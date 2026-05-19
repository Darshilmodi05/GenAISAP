# GenAISAP API Reference Documentation

This document describes all operational REST endpoints exposed by the Next.js Server and the Python Machine Learning service.

---

## 1. Machine Learning Service (Python Engine)

Exposed internally on port `8000` (default config). All endpoints support cross-origin sharing headers and return standard JSON payloads.

### 1.1. Service Health Check
Verify the operational state of the Python ML engine.
*   **Method**: `GET`
*   **Route**: `/health`
*   **Response Payload**:
    ```json
    {
      "status": "healthy",
      "engine": "GenAISAP-ML v1.0 (Pure Python Fallback)",
      "orchestration": "active",
      "timestamp": "local-node"
    }
    ```

### 1.2. Detect Volume Spikes
Evaluates chronological financial streams to discover spike anomalies and generate explanatory natural language narratives.
*   **Method**: `POST`
*   **Route**: `/anomaly/detect-spikes`
*   **Request Payload**:
    ```json
    {
      "data": [12000.50, 11500.00, 48000.00, 13000.40],
      "related_modules": {
        "FICO": "Accrual Ledger",
        "MM": "Stock Inventory"
      }
    }
    ```
*   **Response Payload**:
    ```json
    {
      "success": true,
      "anomalies": [
        {
          "index": 2,
          "value": 48000.00,
          "evidence": {
            "spike_ratio": 4.0,
            "historical_mean": 21125.22,
            "module_context": "Accrual Ledger"
          },
          "narrative": "A major volume spike was identified: 48,000.00 exceeds standard FICO expectations.",
          "severity": "warning"
        }
      ]
    }
    ```

### 1.3. Find Duplicate Postings
Searches transactional ledger sets for duplicates based on transaction matching heuristics.
*   **Method**: `POST`
*   **Route**: `/anomaly/find-duplicates`
*   **Request Payload**:
    ```json
    {
      "postings": [
        { "id": "1001", "amount": 250.00, "vendor": "VEND_A", "date": "2026-05-19" },
        { "id": "1002", "amount": 250.00, "vendor": "VEND_A", "date": "2026-05-19" },
        { "id": "1003", "amount": 890.00, "vendor": "VEND_B", "date": "2026-05-18" }
      ]
    }
    ```
*   **Response Payload**:
    ```json
    {
      "success": true,
      "duplicates": [
        {
          "posting_a": "1001",
          "posting_b": "1002",
          "match_reason": "Identical amount and vendor within same date window"
        }
      ]
    }
    ```

### 1.4. Predict Rolling-Window Forecasts
Generates statistical forecasting metrics for consecutive periods based on a series array.
*   **Method**: `POST`
*   **Route**: `/forecast/predict`
*   **Request Payload**:
    ```json
    {
      "series": [400, 420, 440, 480],
      "periods": 2
    }
    ```
*   **Response Payload**:
    ```json
    {
      "success": true,
      "original_series": [400, 420, 440, 480],
      "predictions": [510.50, 535.20]
    }
    ```

### 1.5. Heuristic Module Classification
Classifies transaction summaries into FICO, MM, SD, or HCM buckets.
*   **Method**: `POST`
*   **Route**: `/classify/module`
*   **Request Payload**:
    ```json
    {
      "description": "Quarterly vendor payment reconciliation for SD invoices"
    }
    ```
*   **Response Payload**:
    ```json
    {
      "module": "FICO",
      "confidence": 0.89,
      "scores": {
        "FICO": 3,
        "MM": 0,
        "SD": 1,
        "HCM": 0
      }
    }
    ```

---

## 2. Next.js Web App API Server Routes

Exposed publicly by the Next.js server on standard port `3000`.

### 2.1. AI Chat Orchestration
Submit chat queries to the GenAISAP conversational engine.
*   **Method**: `POST`
*   **Route**: `/api/ai/chat`
*   **Request Payload**:
    ```json
    {
      "sessionId": "d4b1a2e3-05c0-4e84-8108-ec5ff82c8a07",
      "message": "Analyze FICO ledger spikes from yesterday."
    }
    ```
*   **Response Stream (SSE / Text)**:
    ```text
    data: {"text": "Beginning analysis of historical ledger spikes..."}
    data: {"text": " Correlated volume spike of $48,000 with vendor invoices."}
    ```

### 2.2. Fetch Dashboard Telemetry KPIs
Retrieve global KPIs for active dashboard widgets.
*   **Method**: `GET`
*   **Route**: `/api/metrics`
*   **Response Payload**:
    ```json
    {
      "revenue_mtd": "$24.2M",
      "revenue_trend": "+12.4%",
      "open_pos": 420,
      "dso": "34.5 Days",
      "dso_trend": "-2.1%",
      "system_health": "99.98%",
      "active_users": 18,
      "api_calls": 84200,
      "data_sync": "Active"
    }
    ```

### 2.3. System Governance Alerts List
Retrieve the listing of actively open alerts across all SAP modules.
*   **Method**: `GET`
*   **Route**: `/api/alerts`
*   **Response Payload**:
    ```json
    [
      {
        "id": "e4f5a6b7-05c0-4e84-8108-ec5ff82c8a07",
        "alert_type": "Volume Spike",
        "severity": "critical",
        "title": "Abnormal FICO Posting Activity",
        "description": "Anomaly engine identified 420% volume hike.",
        "sap_module": "FICO",
        "status": "open",
        "detected_at": "2026-05-19T14:00:00Z"
      }
    ]
    ```
