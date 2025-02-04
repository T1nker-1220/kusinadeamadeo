"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { DatabaseState, getDatabaseState } from '@/lib/services/database-state';
import { useEffect, useState } from 'react';

export function DatabaseStateViewer() {
  const [dbState, setDbState] = useState<DatabaseState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDatabaseState() {
      try {
        const state = await getDatabaseState();
        setDbState(state);
      } catch (error) {
        console.error('Error fetching database state:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch database state',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDatabaseState();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Database State</CardTitle>
          <CardDescription>Loading database information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!dbState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Database State</CardTitle>
          <CardDescription>Failed to load database information</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database State</CardTitle>
        <CardDescription>Current state of the database schema and objects</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tables">
          <TabsList>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="enums">Enums</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="triggers">Triggers</TabsTrigger>
          </TabsList>

          <TabsContent value="tables">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              {dbState.tables?.map((table) => (
                <div key={table.name} className="mb-6">
                  <h3 className="text-lg font-semibold">{table.name}</h3>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Columns</h4>
                    {table.columns?.map((column) => (
                      <div key={column.name} className="ml-4 text-sm">
                        <code>{column.name}</code> ({column.type})
                        {column.nullable === 'NO' && ' NOT NULL'}
                        {column.default && ` DEFAULT ${column.default}`}
                      </div>
                    ))}
                  </div>

                  {table.policies && table.policies.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Policies</h4>
                      {table.policies.map((policy) => (
                        <div key={policy.name} className="ml-4 text-sm">
                          <code>{policy.name}</code> ({policy.command})
                        </div>
                      ))}
                    </div>
                  )}

                  {table.indexes && table.indexes.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Indexes</h4>
                      {table.indexes.map((index) => (
                        <div key={index.name} className="ml-4 text-sm">
                          <code>{index.name}</code>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator className="my-4" />
                </div>
              )) || <div>No tables found</div>}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="enums">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              {dbState.enums?.map((enum_) => (
                <div key={enum_.name} className="mb-4">
                  <h3 className="text-lg font-semibold">{enum_.name}</h3>
                  <div className="ml-4">
                    {enum_.values?.map((value) => (
                      <div key={value} className="text-sm">
                        <code>{value}</code>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                </div>
              )) || <div>No enums found</div>}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="functions">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              {dbState.functions?.map((func) => (
                <div key={func.name} className="mb-4">
                  <h3 className="text-lg font-semibold">{func.name}</h3>
                  <div className="ml-4 text-sm">
                    <div>Language: {func.language}</div>
                    <div>Returns: {func.return_type}</div>
                    <div>Arguments: {func.arguments}</div>
                    <div>Security Definer: {func.security_definer ? 'Yes' : 'No'}</div>
                  </div>
                  <Separator className="my-4" />
                </div>
              )) || <div>No functions found</div>}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="triggers">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              {dbState.triggers?.map((trigger) => (
                <div key={trigger.name} className="mb-4">
                  <h3 className="text-lg font-semibold">{trigger.name}</h3>
                  <div className="ml-4 text-sm">
                    <div>Table: {trigger.table}</div>
                    <div>Timing: {trigger.timing}</div>
                    <div>Event: {trigger.event}</div>
                  </div>
                  <Separator className="my-4" />
                </div>
              )) || <div>No triggers found</div>}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
