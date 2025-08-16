export const distance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

// -- Enable RLS on the games table if not already enabled
// ALTER TABLE games ENABLE ROW LEVEL SECURITY;
//
// -- Policy for read access (all authenticated users)
// CREATE POLICY "Authenticated users can read games" ON games
// FOR SELECT TO authenticated
// USING (true);
//
// -- Policy for write access (only hax_server role)
// CREATE POLICY "Hax server can modify games" ON games
// FOR INSERT WITH CHECK ((auth.jwt() ->> 'user_role') = 'hax_server')
// FOR UPDATE USING ((auth.jwt() ->> 'user_role') = 'hax_server')
// WITH CHECK ((auth.jwt() ->> 'user_role') = 'hax_server')
// FOR DELETE USING ((auth.jwt() ->> 'user_role') = 'hax_server')
// TO authenticated;
