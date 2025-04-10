import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/frontend/components/ui/tabs';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Textarea } from '@/frontend/components/ui/textarea';
import { Badge } from '@/frontend/components/ui/badge';
import { Separator } from '@/frontend/components/ui/separator';
import { Code, GitBranch, GitCommit, GitPullRequest, Terminal, FileCode, Database, RefreshCw, Play, Save, Download, Upload } from 'lucide-react';

const DeveloperToolsWireframe = () => {
  return (
    <div className="flex flex-col h-full w-full bg-background p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Developer Tools</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <GitBranch className="mr-2 h-4 w-4" />
            main
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="code">Code Playground</TabsTrigger>
          <TabsTrigger value="api">API Testing</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="version">Version Control</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            {/* Code Editor */}
            <div className="lg:col-span-8 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Code Editor</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">JavaScript</Badge>
                    <Badge variant="outline">React</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 border rounded-md m-4 bg-muted/30">
                  <pre className="p-4 text-xs font-mono overflow-auto h-full">
                    <code className="text-foreground">
{`import React, { useState, useEffect } from 'react';
import { fetchData } from './api';

const DataComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return (
    <div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataComponent;`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar with file explorer and console */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">File Explorer</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 p-1 rounded hover:bg-muted cursor-pointer">
                      <FileCode className="h-4 w-4 text-blue-500" />
                      <span>index.js</span>
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded bg-muted cursor-pointer">
                      <FileCode className="h-4 w-4 text-blue-500" />
                      <span>DataComponent.jsx</span>
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded hover:bg-muted cursor-pointer">
                      <FileCode className="h-4 w-4 text-yellow-500" />
                      <span>api.js</span>
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded hover:bg-muted cursor-pointer">
                      <FileCode className="h-4 w-4 text-green-500" />
                      <span>styles.css</span>
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded hover:bg-muted cursor-pointer">
                      <FileCode className="h-4 w-4 text-orange-500" />
                      <span>package.json</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-2">
                  <div className="flex items-center gap-2 w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="mr-2 h-3 w-3" />
                      Upload
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Console</CardTitle>
                </CardHeader>
                <CardContent className="bg-black text-green-400 p-3 rounded-md text-xs font-mono h-[200px] overflow-y-auto">
                  <div className="space-y-1">
                    <p>> Starting development server...</p>
                    <p>> Compiled successfully!</p>
                    <p>> Server running at http://localhost:3000</p>
                    <p className="text-yellow-400">> Warning: React version not specified in dependencies</p>
                    <p>> GET /api/data 200 OK (124ms)</p>
                    <p className="text-red-400">> Error: Cannot read property 'map' of undefined</p>
                    <p>> at DataComponent.jsx:28:23</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-2">
                  <div className="flex items-center w-full">
                    <Input placeholder="Type command..." className="text-xs" />
                    <Button variant="ghost" size="icon" className="ml-2">
                      <Terminal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            <div className="lg:col-span-8 flex flex-col space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Request</CardTitle>
                  <CardDescription>Test your API endpoints</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <select className="border rounded p-2 bg-background">
                      <option>GET</option>
                      <option>POST</option>
                      <option>PUT</option>
                      <option>DELETE</option>
                    </select>
                    <Input placeholder="https://api.example.com/endpoint" className="flex-1" />
                    <Button>Send</Button>
                  </div>
                  
                  <Tabs defaultValue="params">
                    <TabsList>
                      <TabsTrigger value="params">Params</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                      <TabsTrigger value="body">Body</TabsTrigger>
                    </TabsList>
                    <TabsContent value="params" className="space-y-2 pt-2">
                      <div className="grid grid-cols-3 gap-2">
                        <Input placeholder="Key" />
                        <Input placeholder="Value" />
                        <Button variant="outline">Add</Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="headers" className="space-y-2 pt-2">
                      <div className="grid grid-cols-3 gap-2">
                        <Input placeholder="Key" defaultValue="Content-Type" />
                        <Input placeholder="Value" defaultValue="application/json" />
                        <Button variant="outline">Add</Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="body" className="pt-2">
                      <Textarea 
                        placeholder="Request body in JSON format"
                        className="min-h-[150px] font-mono text-sm"
                        defaultValue={`{
  "name": "Example",
  "description": "Test API request",
  "active": true
}`}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">200 OK</Badge>
                      <span className="text-sm text-muted-foreground">124ms</span>
                    </div>
                    <Separator />
                    <pre className="bg-muted p-4 rounded-md text-sm font-mono overflow-auto max-h-[300px]">
                      <code>
{`{
  "success": true,
  "data": {
    "id": 123,
    "name": "Example",
    "description": "Test API request",
    "active": true,
    "createdAt": "2023-06-15T10:30:00Z"
  }
}`}
                      </code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Saved Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <Badge className="mr-2 bg-green-500 h-2 w-2 p-0 rounded-full" />
                      GET /api/products
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <Badge className="mr-2 bg-blue-500 h-2 w-2 p-0 rounded-full" />
                      POST /api/orders
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <Badge className="mr-2 bg-yellow-500 h-2 w-2 p-0 rounded-full" />
                      PUT /api/users/123
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <Badge className="mr-2 bg-red-500 h-2 w-2 p-0 rounded-full" />
                      DELETE /api/products/456
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Current Request
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="database" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Database Explorer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 p-1 rounded hover:bg-muted cursor-pointer">
                      <Database className="h-4 w-4" />
                      <span className="text-sm font-medium">Tables</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <div className="flex items-center gap-2 p-1 rounded bg-muted cursor-pointer">
                        <span className="text-sm">users</span>
                      </div>
                      <div className="flex items-center gap-2 p-1 rounded hover:bg-muted cursor-pointer">
                        <span className="text-sm">products</span>
                      </div>
                      <div className="flex items-center gap-2 p-1 rounded hover:bg-muted cursor-pointer">
                        <span className="text-sm">orders</span>
                      </div>
                      <div className="flex items-center gap-2 p-1 rounded hover:bg-muted cursor-pointer">
                        <span className="text-sm">categories</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-9 flex flex-col space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>SQL Query</CardTitle>
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Run Query
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    className="font-mono text-sm min-h-[100px]"
                    defaultValue="SELECT * FROM users WHERE active = true ORDER BY created_at DESC LIMIT 10;"
                  />
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Query Results</CardTitle>
                    <Badge>10 rows</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted">
                          <th className="p-2 text-left font-medium">id</th>
                          <th className="p-2 text-left font-medium">name</th>
                          <th className="p-2 text-left font-medium">email</th>
                          <th className="p-2 text-left font-medium">active</th>
                          <th className="p-2 text-left font-medium">created_at</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({length: 5}).map((_, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2">{i + 1}</td>
                            <td className="p-2">User {i + 1}</td>
                            <td className="p-2">user{i + 1}@example.com</td>
                            <td className="p-2">
                              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                true
                              </Badge>
                            </td>
                            <td className="p-2 text-muted-foreground">2023-06-{15 - i}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="version" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            <div className="lg:col-span-8">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Commit History</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <GitBranch className="mr-2 h-4 w-4" />
                        Branches
                      </Button>
                      <Button variant="outline" size="sm">
                        <GitPullRequest className="mr-2 h-4 w-4" />
                        Pull Requests
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div className="space-y-4">
                    {Array.from({length: 5}).map((_, i) => (
                      <div key={i} className="flex gap-3 pb-4 border-b">
                        <div className="mt-1">
                          <GitCommit className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">Update product listing component</h3>
                            <Badge variant="outline" className="text-xs">{`#${1000 + i}`}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Fixed pagination and improved mobile responsiveness
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Committed by John Doe</span>
                            <span>•</span>
                            <span>{`${i + 1} day${i > 0 ? 's' : ''} ago`}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Repository Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Repository:</span>
                        <span className="font-medium">wemarka-platform</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Current branch:</span>
                        <span className="font-medium">main</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Last commit:</span>
                        <span className="font-medium">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Contributors:</span>
                        <span className="font-medium">5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start text-sm">
                        <Code className="mr-2 h-4 w-4" />
                        Create new branch
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-sm">
                        <GitCommit className="mr-2 h-4 w-4" />
                        Commit changes
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-sm">
                        <GitPullRequest className="mr-2 h-4 w-4" />
                        Create pull request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="logs" className="flex-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>System Logs</CardTitle>
                <div className="flex items-center gap-2">
                  <select className="border rounded p-1 text-sm bg-background">
                    <option>All Logs</option>
                    <option>Errors</option>
                    <option>Warnings</option>
                    <option>Info</option>
                  </select>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-start gap-2 p-2 rounded bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300">
                  <span className="font-bold">[ERROR]</span>
                  <div>
                    <p>Failed to connect to database - Connection timeout</p>
                    <p className="text-xs opacity-70">2023-06-15 14:32:45</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 rounded bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
                  <span className="font-bold">[WARN]</span>
                  <div>
                    <p>High memory usage detected (85%)</p>
                    <p className="text-xs opacity-70">2023-06-15 14:30:12</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 rounded">
                  <span className="font-bold">[INFO]</span>
                  <div>
                    <p>User authentication successful: user@example.com</p>
                    <p className="text-xs opacity-70">2023-06-15 14:28:33</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 rounded">
                  <span className="font-bold">[INFO]</span>
                  <div>
                    <p>API request: GET /api/products - 200 OK</p>
                    <p className="text-xs opacity-70">2023-06-15 14:27:55</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 rounded bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
                  <span className="font-bold">[WARN]</span>
                  <div>
                    <p>Slow query detected: SELECT * FROM orders WHERE created_at > '2023-01-01' (2.5s)</p>
                    <p className="text-xs opacity-70">2023-06-15 14:25:18</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 rounded">
                  <span className="font-bold">[INFO]</span>
                  <div>
                    <p>System backup completed successfully</p>
                    <p className="text-xs opacity-70">2023-06-15 14:00:00</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 rounded bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300">
                  <span className="font-bold">[ERROR]</span>
                  <div>
                    <p>Payment processing failed: Invalid card information</p>
                    <p className="text-xs opacity-70">2023-06-15 13:45:22</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Logs
                </Button>
                <p className="text-sm text-muted-foreground">Showing 7 of 124 log entries</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperToolsWireframe;
