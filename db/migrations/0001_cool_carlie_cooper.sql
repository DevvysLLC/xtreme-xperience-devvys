CREATE TABLE "app"."rocket_rez_orders" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" integer NOT NULL,
	"user_guid" text NOT NULL,
	"email" text NOT NULL,
	"order" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rocket_rez_orders_external_id_unique" UNIQUE("external_id")
);