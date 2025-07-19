mod db;
mod schema;

use db::{establish_connection, Plan};
use diesel::prelude::*;
use chrono::Utc;

fn main() {
    let mut conn = establish_connection(); // MUST be mut

    let plan = Plan {
        id: "pro".to_string(),
        name: "Pro Plan".to_string(),
        quota_json: r#"{"max_projects":10,"max_storage_gb":100,"max_compute":2,"max_replicas":3}"#.to_string(),
        created_at: Utc::now().naive_utc(),
    };

    diesel::insert_into(schema::plans::table)
        .values(&plan)
        .execute(&mut conn) // <-- check this!!!
        .expect("Insert plan failed!");

    println!("Seeded plan.");
}
