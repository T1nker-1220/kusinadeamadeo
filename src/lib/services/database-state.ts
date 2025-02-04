import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface DatabaseState {
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      type: string;
      nullable: string;
      default: string | null;
    }>;
    policies: Array<{
      name: string;
      command: string;
      roles: string[];
      using: string;
      with_check: string;
    }>;
    indexes: Array<{
      name: string;
      definition: string;
    }>;
  }>;
  enums: Array<{
    name: string;
    values: string[];
  }>;
  functions: Array<{
    name: string;
    language: string;
    return_type: string;
    arguments: string;
    security_definer: boolean;
  }>;
  triggers: Array<{
    name: string;
    table: string;
    timing: string;
    event: string;
    definition: string;
  }>;
}

export async function getDatabaseState(): Promise<DatabaseState> {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase.rpc('get_database_state');

  if (error) {
    console.error('Error fetching database state:', error);
    throw new Error('Failed to fetch database state');
  }

  return data as DatabaseState;
}
