CREATE SCHEMA IF NOT EXISTS "app";
--> statement-breakpoint
CREATE TABLE "app"."rocket_rez_products_events" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"category" text,
	"event" jsonb,
	"schedules" jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"list_synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"event_synced_at" timestamp with time zone,
	"schedules_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rocket_rez_products_events_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "app"."rocket_rez_products_retail" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"category" text,
	"retail_payload" jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"list_synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"retail_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rocket_rez_products_retail_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE INDEX "rocket_rez_products_events_name_idx" ON "app"."rocket_rez_products_events" USING btree ("name");--> statement-breakpoint
CREATE INDEX "rocket_rez_products_events_active_idx" ON "app"."rocket_rez_products_events" USING btree ("active");--> statement-breakpoint
CREATE INDEX "rocket_rez_products_retail_name_idx" ON "app"."rocket_rez_products_retail" USING btree ("name");--> statement-breakpoint
CREATE INDEX "rocket_rez_products_retail_active_idx" ON "app"."rocket_rez_products_retail" USING btree ("active");
