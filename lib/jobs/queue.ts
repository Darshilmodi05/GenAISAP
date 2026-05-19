import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { createClient } from '@/lib/supabase/server';

// Redis connection for BullMQ
const connection = new IORedis(process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Job queues
export const reportGenerationQueue = new Queue('report-generation', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

export const dataSyncQueue = new Queue('data-sync', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

export const notificationQueue = new Queue('notifications', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Job types
export interface ReportGenerationJob {
  type: 'monthly_report' | 'quarterly_report' | 'custom_report';
  tenantId: string;
  userId: string;
  parameters: {
    startDate: string;
    endDate: string;
    format: 'pdf' | 'excel';
    modules: string[];
    priority?: 'low' | 'medium' | 'high';
  };
}

export interface DataSyncJob {
  type: 'fico_sync' | 'sd_sync' | 'mm_sync' | 'full_sync';
  tenantId: string;
  parameters: {
    companyCode?: string;
    businessArea?: string;
    incremental?: boolean;
  };
}

export interface NotificationJob {
  type: 'email' | 'in_app' | 'webhook';
  tenantId: string;
  userId?: string;
  parameters: {
    subject: string;
    message: string;
    recipients?: string[];
    priority: 'low' | 'medium' | 'high';
  };
}

// Report generation worker
export const reportGenerationWorker = new Worker<ReportGenerationJob>(
  'report-generation',
  async (job) => {
    const { type, tenantId, userId, parameters } = job.data;
    
    try {
      console.log(`Starting ${type} generation for tenant ${tenantId}`);
      
      // Update job status in database
      const supabase = await createClient();
      await supabase
        .from('job_status')
        .insert({
          job_id: job.id,
          tenant_id: tenantId,
          user_id: userId,
          type: 'report_generation',
          status: 'processing',
          started_at: new Date().toISOString(),
        });

      // Simulate report generation (in production, this would call actual SAP services)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Generate mock report data
      const reportData = {
        id: `report_${Date.now()}`,
        type,
        tenantId,
        generatedAt: new Date().toISOString(),
        parameters,
        downloadUrl: `/api/reports/download/${job.id}`,
      };

      // Update job status as completed
      await supabase
        .from('job_status')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          result: reportData,
        })
        .eq('job_id', job.id);

      // Send notification
      await notificationQueue.add('send_notification', {
        type: 'email',
        tenantId,
        userId,
        parameters: {
          subject: `Report Ready: ${type}`,
          message: `Your ${type} report is ready for download.`,
          priority: 'medium',
        },
      });

      console.log(`Completed ${type} generation for tenant ${tenantId}`);
      return reportData;
    } catch (error) {
      console.error(`Failed to generate ${type} report:`, error);
      
      // Update job status as failed
      const supabase = await createClient();
      await supabase
        .from('job_status')
        .update({ 
          status: 'failed',
          completed_at: new Date().toISOString(),
          error: (error as any).message,
        })
        .eq('job_id', job.id);
      
      throw error;
    }
  },
  { connection }
);

// Data sync worker
export const dataSyncWorker = new Worker<DataSyncJob>(
  'data-sync',
  async (job) => {
    const { type, tenantId, parameters } = job.data;
    
    try {
      console.log(`Starting ${type} sync for tenant ${tenantId}`);
      
      const supabase = await createClient();
      await supabase
        .from('job_status')
        .insert({
          job_id: job.id,
          tenant_id: tenantId,
          type: 'data_sync',
          status: 'processing',
          started_at: new Date().toISOString(),
        });

      // Simulate data sync (in production, this would connect to SAP systems)
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      const syncResult = {
        syncedRecords: Math.floor(Math.random() * 10000) + 1000,
        errors: 0,
        duration: '10.5 seconds',
        type,
        tenantId,
        syncedAt: new Date().toISOString(),
      };

      await supabase
        .from('job_status')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          result: syncResult,
        })
        .eq('job_id', job.id);

      console.log(`Completed ${type} sync for tenant ${tenantId}`);
      return syncResult;
    } catch (error) {
      console.error(`Failed to sync ${type} data:`, error);
      
      const supabase = await createClient();
      await supabase
        .from('job_status')
        .update({ 
          status: 'failed',
          completed_at: new Date().toISOString(),
          error: (error as any).message,
        })
        .eq('job_id', job.id);
      
      throw error;
    }
  },
  { connection }
);

// Notification worker
export const notificationWorker = new Worker<NotificationJob>(
  'notifications',
  async (job) => {
    const { type, tenantId, userId, parameters } = job.data;
    
    try {
      console.log(`Sending ${type} notification for tenant ${tenantId}`);
      
      const supabase = await createClient();
      await supabase
        .from('notifications')
        .insert({
          tenant_id: tenantId,
          user_id: userId,
          type,
          subject: parameters.subject,
          message: parameters.message,
          priority: parameters.priority,
          status: 'sent',
          created_at: new Date().toISOString(),
        });

      // In production, this would send actual emails/webhooks
      if (type === 'email') {
        console.log(`Email sent: ${parameters.subject}`);
      }
      
      return { sent: true, type, parameters };
    } catch (error) {
      console.error(`Failed to send ${type} notification:`, error);
      throw error;
    }
  },
  { connection }
);

// Queue management functions
export async function addReportGenerationJob(jobData: ReportGenerationJob) {
  return await reportGenerationQueue.add('generate_report', jobData, {
    delay: 0,
    priority: jobData.parameters.priority === 'high' ? 10 : 1,
  });
}

export async function addDataSyncJob(jobData: DataSyncJob) {
  return await dataSyncQueue.add('sync_data', jobData, {
    delay: 0,
    priority: jobData.type === 'full_sync' ? 10 : 1,
  });
}

export async function addNotificationJob(jobData: NotificationJob) {
  return await notificationQueue.add('send_notification', jobData, {
    delay: 0,
    priority: jobData.parameters.priority === 'high' ? 10 : 1,
  });
}

// Job status checking
export async function getJobStatus(jobId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_status')
    .select('*')
    .eq('job_id', jobId)
    .single();
  
  return { data, error };
}

export async function getUserJobs(userId: string, tenantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_status')
    .select('*')
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(50);
  
  return { data, error };
}
