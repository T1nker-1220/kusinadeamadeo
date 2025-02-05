"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { getDatabaseState } from '@/lib/services/database-state';
import {
  DatabaseState
} from "@/lib/types/database-state";
import { formatBytes } from "@/lib/utils";
import { Copy, Database, FileJson, FunctionSquare, Key, List, Lock, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export function DatabaseStateViewer() {
  const [dbState, setDbState] = useState<DatabaseState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "tables"
    | "enums"
    | "functions"
    | "triggers"
    | "contents"
    | "storage"
  >("tables");

  useEffect(() => {
    async function fetchDatabaseState() {
      try {
        const data = await getDatabaseState();
        setDbState(data as unknown as DatabaseState);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching database state:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch database state',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    }

    fetchDatabaseState();
  }, []);

  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  }, []);

  const filteredTables = useMemo(() => {
    if (!dbState?.tables || !searchQuery) return dbState?.tables;
    return dbState.tables.filter(table =>
      table.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dbState?.tables, searchQuery]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <div>
              <CardTitle>Database State</CardTitle>
              <CardDescription>Loading database information...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  if (!dbState) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2 text-destructive">
            <Database className="h-6 w-6" />
            <div>
              <CardTitle>Database State</CardTitle>
              <CardDescription>Failed to load database information</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="enums">Enums</TabsTrigger>
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="contents">Contents</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>
        <TabsContent value="tables">
          <Card className="border-none shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-6 w-6" />
                  <div>
                    <CardTitle>Database State</CardTitle>
                    <CardDescription>View the current state of the database schema and objects</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search database objects..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyToClipboard(JSON.stringify(dbState, null, 2))}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] rounded-md border">
                <div className="p-4 space-y-4">
                  {filteredTables?.map((table) => (
                    <Collapsible key={table.name}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
                        <div className="flex items-center space-x-2">
                          <Table className="h-4 w-4" />
                          <span className="font-medium">{table.name}</span>
                          <Badge variant="outline">{table.columns?.length || 0} columns</Badge>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 p-4">
                        <div className="rounded-md bg-muted p-4">
                          <h4 className="mb-2 font-medium">Columns</h4>
                          <div className="space-y-2">
                            {table.columns?.map((column) => (
                              <div key={column.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-sm">{column.name}</span>
                                  <span className="text-sm text-muted-foreground">{column.type}</span>
                                </div>
                                <div className="flex space-x-2">
                                  {column.isPrimaryKey && (
                                    <Badge variant="default">Primary Key</Badge>
                                  )}
                                  {column.isForeignKey && (
                                    <Badge variant="secondary">Foreign Key</Badge>
                                  )}
                                  {column.isNullable && (
                                    <Badge variant="outline">Nullable</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {table.policies && table.policies.length > 0 && (
                          <div className="rounded-md bg-muted p-4">
                            <h4 className="mb-2 font-medium">RLS Policies</h4>
                            <div className="space-y-2">
                              {table.policies.map((policy) => (
                                <div key={policy.name} className="flex items-center space-x-2">
                                  <Lock className="h-4 w-4" />
                                  <span className="font-mono text-sm">{policy.name}</span>
                                  <Badge variant="outline">{policy.action}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {table.indexes && table.indexes.length > 0 && (
                          <div className="rounded-md bg-muted p-4">
                            <h4 className="mb-2 font-medium">Indexes</h4>
                            <div className="space-y-2">
                              {table.indexes.map((index) => (
                                <div key={index.name} className="flex items-center space-x-2">
                                  <span className="font-mono text-sm">{index.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyToClipboard(index.definition)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="enums">
          <ScrollArea className="h-[600px] rounded-md border">
            <div className="p-4 space-y-4">
              {dbState.enums?.map((enum_) => (
                <Collapsible key={enum_.name}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
                    <div className="flex items-center space-x-2">
                      <List className="h-4 w-4" />
                      <span className="font-medium">{enum_.name}</span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 p-4">
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Values</h4>
                      <div className="space-y-2">
                        {enum_.values?.map((value) => (
                          <div key={value} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-sm">{value}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyToClipboard(value)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="functions">
          <ScrollArea className="h-[600px] rounded-md border">
            <div className="p-4 space-y-4">
              {dbState.functions?.map((func) => (
                <Collapsible key={func.name}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
                    <div className="flex items-center space-x-2">
                      <FunctionSquare className="h-4 w-4" />
                      <span className="font-medium">{func.name}</span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 p-4">
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Language</h4>
                      <div className="space-y-2">
                        <span className="font-mono text-sm">{func.language}</span>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Return Type</h4>
                      <div className="space-y-2">
                        <span className="font-mono text-sm">{func.returnType}</span>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Arguments</h4>
                      <div className="space-y-2">
                        {typeof func.arguments === 'string' ? (
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm">{func.arguments}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyToClipboard(JSON.stringify(func.arguments))}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No arguments</span>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="triggers">
          <ScrollArea className="h-[600px] rounded-md border">
            <div className="p-4 space-y-4">
              {dbState.triggers?.map((trigger) => (
                <Collapsible key={trigger.name}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4" />
                      <span className="font-medium">{trigger.name}</span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 p-4">
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Table</h4>
                      <div className="space-y-2">
                        <span className="font-mono text-sm">{trigger.table}</span>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Function</h4>
                      <div className="space-y-2">
                        <span className="font-mono text-sm">{trigger.function}</span>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Events</h4>
                      <div className="space-y-2">
                        {trigger.events?.map((event) => (
                          <div key={event} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-sm">{event}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyToClipboard(event)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="contents">
          <ScrollArea className="h-[600px] rounded-md border">
            <div className="p-4">
              {Object.entries(dbState.table_contents || {}).map(([tableName, rows]) => (
                <Collapsible key={tableName}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
                    <div className="flex items-center space-x-2">
                      <FileJson className="h-4 w-4" />
                      <span className="font-medium">{tableName}</span>
                      <Badge variant="outline">{Array.isArray(rows) ? rows.length : 0} rows</Badge>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {rows && rows.length > 0 && Object.keys(rows[0]).map((column) => (
                              <th key={column} className="p-2 text-left font-medium">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows && rows.length > 0 && rows.map((row, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                              {Object.values(row).map((value, i) => (
                                <td key={i} className="p-2">
                                  {typeof value === 'object'
                                    ? JSON.stringify(value)
                                    : String(value)
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="storage">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {formatBytes(dbState.storage.total_size)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Objects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {dbState.storage.object_count}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Buckets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {dbState.storage.buckets.length}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4">
              {dbState.storage.buckets.map((bucket) => (
                <Card key={bucket.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{bucket.name}</span>
                      <Badge variant={bucket.public ? "default" : "secondary"}>
                        {bucket.public ? "Public" : "Private"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Created {new Date(bucket.created_at).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Accessed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bucket.objects?.map((obj) => (
                            <TableRow key={obj.name}>
                              <TableCell className="font-medium">
                                {obj.name}
                              </TableCell>
                              <TableCell>{formatBytes(parseInt(obj.size))}</TableCell>
                              <TableCell>{obj.mimetype}</TableCell>
                              <TableCell>
                                {new Date(obj.created_at).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {new Date(obj.last_accessed_at).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                          {!bucket.objects?.length && (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center text-muted-foreground"
                              >
                                No objects in this bucket
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
