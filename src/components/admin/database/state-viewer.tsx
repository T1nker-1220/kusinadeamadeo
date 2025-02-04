"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { getDatabaseState } from '@/lib/services/database-state';
import {
  DatabaseState
} from "@/lib/types/database-state";
import { Copy, Database, FileJson, FunctionSquare, Key, List, Lock, Search, Table } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export function DatabaseStateViewer() {
  const [dbState, setDbState] = useState<DatabaseState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

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
        <Tabs defaultValue="tables" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tables" className="flex items-center space-x-2">
              <Table className="h-4 w-4" />
              <span>Tables</span>
              <Badge variant="secondary" className="ml-2">{dbState.tables?.length || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="enums" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>Enums</span>
              <Badge variant="secondary" className="ml-2">{dbState.enums?.length || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="functions" className="flex items-center space-x-2">
              <FunctionSquare className="h-4 w-4" />
              <span>Functions</span>
              <Badge variant="secondary" className="ml-2">{dbState.functions?.length || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="triggers" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Triggers</span>
              <Badge variant="secondary" className="ml-2">{dbState.triggers?.length || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="contents" className="flex items-center space-x-2">
              <FileJson className="h-4 w-4" />
              <span>Contents</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="enums" className="space-y-4">
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

          <TabsContent value="functions" className="space-y-4">
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
                                onClick={() => handleCopyToClipboard(func.arguments)}
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

          <TabsContent value="triggers" className="space-y-4">
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

          <TabsContent value="contents" className="space-y-4">
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
        </Tabs>
      </CardContent>
    </Card>
  );
}
