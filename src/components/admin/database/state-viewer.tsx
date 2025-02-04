"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { getDatabaseState } from '@/lib/services/database-state';
import {
  ColumnInfo,
  DatabaseState,
  EnumType,
  FunctionInfo,
  IndexInfo,
  RLSPolicy,
  TableInfo,
  TriggerInfo
} from "@/lib/types/database-state";
import { useEffect, useState } from 'react';

export function DatabaseStateViewer() {
  const [dbState, setDbState] = useState<DatabaseState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <CardDescription>View the current state of the database schema and objects</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tables">
          <TabsList>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="enums">Enums</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="triggers">Triggers</TabsTrigger>
            <TabsTrigger value="contents">Contents</TabsTrigger>
          </TabsList>

          <TabsContent value="tables">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              {dbState?.tables && dbState.tables.length > 0 ? (
                dbState.tables.map((table: TableInfo) => (
                  <div key={table.name}>
                    <h3 className="text-lg font-semibold">{table.name}</h3>
                    <div className="ml-4">
                      <h4 className="font-medium">Columns:</h4>
                      {table.columns && table.columns.length > 0 ? (
                        table.columns.map((column: ColumnInfo) => (
                          <div key={column.name} className="ml-4">
                            {column.name} ({column.type})
                          </div>
                        ))
                      ) : (
                        <div className="ml-4">No columns found</div>
                      )}
                      <h4 className="mt-2 font-medium">Policies:</h4>
                      {table.policies && table.policies.length > 0 ? (
                        table.policies.map((policy: RLSPolicy) => (
                          <div key={policy.name} className="ml-4">
                            {policy.name} - {policy.definition}
                          </div>
                        ))
                      ) : (
                        <div className="ml-4">No policies found</div>
                      )}
                      <h4 className="mt-2 font-medium">Indexes:</h4>
                      {table.indexes && table.indexes.length > 0 ? (
                        table.indexes.map((index: IndexInfo) => (
                          <div key={index.name} className="ml-4">
                            {index.name} - {index.definition}
                          </div>
                        ))
                      ) : (
                        <div className="ml-4">No indexes found</div>
                      )}
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))
              ) : (
                <div>No tables found</div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="enums">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              {dbState?.enums && dbState.enums.length > 0 ? (
                dbState.enums.map((enum_: EnumType) => (
                  <div key={enum_.name}>
                    <h3 className="text-lg font-semibold">{enum_.name}</h3>
                    <div className="ml-4">
                      {enum_.values && enum_.values.length > 0 ? (
                        enum_.values.map((value: string) => (
                          <div key={value} className="ml-4">
                            {value}
                          </div>
                        ))
                      ) : (
                        <div className="ml-4">No values found</div>
                      )}
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))
              ) : (
                <div>No enums found</div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="functions">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              {dbState?.functions && dbState.functions.length > 0 ? (
                dbState.functions.map((func: FunctionInfo) => (
                  <div key={func.name}>
                    <h3 className="text-lg font-semibold">{func.name}</h3>
                    <div className="ml-4">
                      <p>Language: {func.language}</p>
                      <p>Return Type: {func.returnType}</p>
                      <h4 className="mt-2 font-medium">Arguments:</h4>
                      {Array.isArray(func.arguments) && func.arguments.length > 0 ? (
                        func.arguments.map((arg) => (
                          <div key={arg.name} className="ml-4">
                            {arg.name}: {arg.type}
                          </div>
                        ))
                      ) : (
                        <div className="ml-4">No arguments</div>
                      )}
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))
              ) : (
                <div>No functions found</div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="triggers">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              {dbState?.triggers && dbState.triggers.length > 0 ? (
                dbState.triggers.map((trigger: TriggerInfo) => (
                  <div key={trigger.name}>
                    <h3 className="text-lg font-semibold">{trigger.name}</h3>
                    <div className="ml-4">
                      <p>Table: {trigger.table}</p>
                      <p>Function: {trigger.function}</p>
                      <h4 className="mt-2 font-medium">Events:</h4>
                      {trigger.events && trigger.events.length > 0 ? (
                        trigger.events.map((event: string) => (
                          <div key={event} className="ml-4">
                            {event}
                          </div>
                        ))
                      ) : (
                        <div className="ml-4">No events found</div>
                      )}
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))
              ) : (
                <div>No triggers found</div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contents">
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              {dbState?.table_contents && Object.keys(dbState.table_contents).length > 0 ? (
                Object.entries(dbState.table_contents).map(([tableName, rows]) => (
                  <div key={tableName} className="mb-6">
                    <h3 className="text-lg font-semibold">{tableName}</h3>
                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {rows && rows.length > 0 &&
                              Object.keys(rows[0]).map((column) => (
                                <th key={column} className="p-2 text-left font-medium">
                                  {column}
                                </th>
                              ))
                            }
                          </tr>
                        </thead>
                        <tbody>
                          {rows && rows.length > 0 && rows.map((row, index) => (
                            <tr key={index} className="border-b">
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
                    <Separator className="my-4" />
                  </div>
                ))
              ) : (
                <div>No table contents found</div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
