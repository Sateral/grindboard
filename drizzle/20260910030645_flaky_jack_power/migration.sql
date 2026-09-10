CREATE TYPE "pipeline_status" AS ENUM('saved', 'applied', 'oa', 'interview', 'offer', 'rejected');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"company" text NOT NULL,
	"role" text NOT NULL,
	"url" text,
	"status" "pipeline_status" DEFAULT 'saved'::"pipeline_status" NOT NULL,
	"deadline" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "applications_user_id_idx" ON "applications" ("user_id");--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;