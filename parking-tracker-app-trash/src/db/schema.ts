import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  index,
  text,
  pgTable,
  serial,
  uuid,
  varchar,
  unique, // integer,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

// Checkout the many-to-many relationship in the following tutorial:
// https://orm.drizzle.team/docs/rqb#many-to-many

export const parkingsTable = pgTable(
  "parkings",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    latitude: varchar("latitude", { length: 100 }),
    longitude: varchar("longitude", { length: 100 }),
    polygon: text('polygon_axes',),
    currMotor: integer('curr_motor'),
    maxSpace: integer("max_space"),

  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
  }),
);

//Events

//Hero

//Contact Persons
