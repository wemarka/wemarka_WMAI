# Execute SQL Edge Function

This edge function allows executing SQL statements directly in the Supabase database using the service role key.

## Features

- Executes SQL statements using the `exec_sql` function
- Creates the `exec_sql` function if it doesn't exist
- Handles CORS for cross-origin requests
- Provides detailed error messages

## Usage

```javascript
const response = await fetch(`${supabaseUrl}/functions/v1/execute-sql`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  },
  body: JSON.stringify({ sql: "SELECT * FROM your_table LIMIT 10" }),
});

const result = await response.json();
```

## Parameters

The function accepts the following parameters in the request body:

- `sql` or `sql_text`: The SQL statement to execute

## CORS Support

The function includes CORS headers to allow cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, authorization, x-client-info, apikey
```

## Error Handling

The function returns detailed error messages in case of failure, including:

- Authentication errors
- Missing SQL statement
- SQL execution errors
- Function creation errors

## Security

This function uses the service role key to execute SQL statements, which has full access to the database. It should be used with caution and only in secure environments.
