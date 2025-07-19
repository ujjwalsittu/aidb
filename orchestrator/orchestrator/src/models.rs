use super::schema::*;
use chrono::{NaiveDateTime};
use serde::{Serialize, Deserialize};

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = workspaces)]
pub struct Workspace {
    pub id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
    pub plan_id: String,
}

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = projects)]
pub struct Project {
    pub id: String,
    pub workspace_id: String,
    pub name: String,
    pub postgres_version: String,
    pub branch_of: Option<String>,
    pub created_at: NaiveDateTime,
}

#[derive(Queryable, Insertable, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = plans)]
pub struct Plan {
    pub id: String,
    pub name: String,
    pub details_json: String,
    pub created_at: NaiveDateTime,
}
