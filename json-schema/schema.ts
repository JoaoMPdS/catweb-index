export interface Schema {
   subdomains: {
      [key: string]: Array<{
         path: string;
         title: string;
         description?: string;
         iconId?: number;
      }>;
   };
   visits: {
      current: number;
      updatedAt: string;
   };
   creatorId: number;
   createdAt: string;
   website_type: string,
}
