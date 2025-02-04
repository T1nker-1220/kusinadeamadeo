export interface TableInfo {
  name: string;
  schema: string;
  columns: ColumnInfo[];
  policies: RLSPolicy[];
  indexes: IndexInfo[];
  triggers: TriggerInfo[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  isNullable: boolean;
  defaultValue?: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface RLSPolicy {
  name: string;
  schema: string;
  table: string;
  action: string;
  roles: string[];
  command: string;
  definition: string;
}

export interface IndexInfo {
  name: string;
  table: string;
  schema: string;
  definition: string;
  isUnique: boolean;
}

export interface EnumType {
  name: string;
  schema: string;
  values: string[];
}

export interface TriggerInfo {
  name: string;
  table: string;
  schema: string;
  function: string;
  events: string[];
}

export interface FunctionInfo {
  name: string;
  schema: string;
  language: string;
  definition: string;
  returnType: string;
  arguments: {
    name: string;
    type: string;
  }[];
}

export interface SchemaInfo {
  name: string;
  tables: TableInfo[];
  functions: FunctionInfo[];
  enums: EnumType[];
}

export interface DatabaseState {
  tables: TableInfo[];
  enums: EnumType[];
  functions: FunctionInfo[];
  triggers: TriggerInfo[];
  table_contents: {
    [tableName: string]: Array<Record<string, unknown>>;
  };
  timestamp: string;
  version: string;
}
