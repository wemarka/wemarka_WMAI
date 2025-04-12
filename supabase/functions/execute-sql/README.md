# Execute SQL Edge Function

This edge function provides a secure way to execute SQL statements in your Supabase database.

## Features

- Executes SQL statements using the `exec_sql` RPC function
- Handles errors gracefully
- Logs operations to the `migration_logs` table
- Provides detailed execution information
- Implements proper CORS headers

## Usage

```javascript
const { data, error } = await supabase.functions.invoke("execute-sql", {
  body: { 
    sql: "CREATE TABLE test (id serial primary key, name text)", 
    operation_id: "create-test-table-123" // optional
  },
});
```

## Parameters

- `sql` (required): The SQL statement to execute
- `operation_id` (optional): A unique identifier for the operation, used for logging

## Response

Successful response:
```json
{
  "success": true,
  "data": { ... },
  "details": {
    "executionTimeMs": 123
  }
}
```

Error response:
```json
{
  "success": false,
  "error": "Error message",
  "details": {
    "executionTimeMs": 45,
    "error": { ... }
  }
}
```

## Security

This function uses the service role key to execute SQL statements, so it should be used with caution. Make sure to validate and sanitize any user input before passing it to this function.

## Deployment

Deploy this function using the Supabase CLI:

```bash
supabase functions deploy execute-sql
```

Or use the provided script:

```bash
node scripts/deploy-edge-function.js execute-sql
```