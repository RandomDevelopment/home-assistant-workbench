import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const installations = sqliteTable('installations', {
 id:text('id').primaryKey(), owner:text('owner').notNull(), name:text('name').notNull(), url:text('url').notNull(), secret:text('secret'), mode:text('mode').notNull().default('read'), notes:text('notes').notNull().default(''), snapshot:text('snapshot'), checkedAt:integer('checked_at'), createdAt:integer('created_at').notNull()
},t=>[index('installations_owner').on(t.owner)]);
export const oauthStates=sqliteTable('oauth_states',{id:text('id').primaryKey(),owner:text('owner').notNull(),installation:text('installation').notNull(),nonce:text('nonce').notNull(),expiresAt:integer('expires_at').notNull()});
export const changes=sqliteTable('changes',{id:text('id').primaryKey(),owner:text('owner').notNull(),installation:text('installation').notNull(),payload:text('payload').notNull(),expiresAt:integer('expires_at').notNull(),claimedAt:integer('claimed_at')});
export const components=sqliteTable('components',{id:text('id').primaryKey(),owner:text('owner').notNull(),installation:text('installation').notNull(),name:text('name').notNull(),kind:text('kind').notNull(),repo:text('repo').notNull(),version:text('version').notNull(),docs:text('docs'),notes:text('notes').notNull().default('')},t=>[index('components_installation').on(t.owner,t.installation)]);
export const feedback=sqliteTable('feedback',{
 id:text('id').primaryKey(),owner:text('owner').notNull(),kind:text('kind').notNull(),title:text('title').notNull(),details:text('details').notNull(),context:text('context'),status:text('status').notNull().default('new'),reply:text('reply').notNull().default(''),issueUrl:text('issue_url'),createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull()
},t=>[index('feedback_owner_created').on(t.owner,t.createdAt)]);
