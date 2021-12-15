import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database 
export const supabase = createClient('https://yydpkixeytdubslvxpwt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNTAwMTMzMCwiZXhwIjoxOTUwNTc3MzMwfQ.lenH9CcLcBMj5DXX973F9C7gXZLdd4mTngnUj08AfA0')