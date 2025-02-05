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
  triggers: TriggerInfo[] | null;
  table_contents: Record<string, any[]>;
  storage: StorageInfo;
  timestamp: string;
  version: string;
}

export interface StorageInfo {
  buckets: StorageBucket[];
  total_size: number;
  object_count: number;
}

export interface StorageBucket {
  id: string;
  name: string;
  owner: string;
  public: boolean;
  created_at: string;
  updated_at: string;
  objects: StorageObject[];
}

export interface StorageObject {
  name: string;
  bucket_id: string;
  owner: string;
  size: string;
  mimetype: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}
