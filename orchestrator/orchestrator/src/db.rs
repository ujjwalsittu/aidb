use diesel::prelude::*;
use chrono::NaiveDateTime;
use crate::schema::*;
use serde_json::Value;



#[derive(Queryable, Insertable, Debug, Clone, serde::Serialize)]
#[diesel(table_name = workspaces)]
pub struct Workspace {
    pub id: String,
    pub name: String,
    pub plan_id: String,
    pub created_at: NaiveDateTime,
}

#[derive(Queryable, Insertable, Debug, Clone, serde::Serialize)]
#[diesel(table_name = projects)]
pub struct Project {
    pub id: String,
    pub workspace_id: String,
    pub db_version: String,
    pub status: String,
    pub created_at: NaiveDateTime,
}

#[derive(Queryable, Insertable, Debug, Clone, serde::Serialize)]
#[diesel(table_name = plans)]
pub struct Plan {
    pub id: String,
    pub name: String,
    pub quota_json: String,
    pub created_at: NaiveDateTime,
}

pub fn establish_connection() -> diesel::SqliteConnection {
    dotenvy::dotenv().ok();
    let url = std::env::var("DATABASE_URL").expect("DATABASE_URL not set");
    diesel::SqliteConnection::establish(&url).unwrap()
}

pub fn workspace_exists(conn: &mut diesel::SqliteConnection, _id: &str) -> bool {
    use crate::schema::workspaces::dsl::*;
    match workspaces.filter(crate::schema::workspaces::dsl::id.eq(id))
        .first::<Workspace>(conn) {
            Ok(_) => true,
            Err(_) => false
        }
}

pub fn insert_workspace(conn: &mut diesel::SqliteConnection, ws: Workspace) -> diesel::QueryResult<usize> {
    diesel::insert_into(workspaces::table).values(&ws).execute(conn)
}

pub fn insert_project(conn: &mut diesel::SqliteConnection, pj: Project) -> diesel::QueryResult<usize> {
    diesel::insert_into(projects::table).values(&pj).execute(conn)
}

pub fn get_projects_by_workspace(conn: &mut diesel::SqliteConnection, ws_id: &str) -> Vec<Project> {
    use crate::schema::projects::dsl::*;
    projects.filter(workspace_id.eq(ws_id))
        .load::<Project>(conn)
        .unwrap_or_else(|_| vec![])
}

pub fn list_workspace_ids(conn: &mut diesel::SqliteConnection) -> Vec<String> {
    use crate::schema::workspaces::dsl::*;
    workspaces.select(id)
        .load::<String>(conn)
        .unwrap_or_else(|_| vec![])
}

pub fn check_plan_quota(conn: &mut diesel::SqliteConnection, plan_id: &str, workspace_id: &str) -> Result<(), String> {
    use crate::schema::plans::dsl::{plans, id as plan_id_col};
    let plan_row: Plan = plans.filter(plan_id_col.eq(plan_id)).first(conn).map_err(|e| format!("Plan not found: {:?}", e))?;
    let v: Value = serde_json::from_str(&plan_row.quota_json).map_err(|e| format!("Invalid quota: {:?}", e))?;
    let max_projects: i64 = v["max_projects"].as_i64().unwrap_or(0);

    use crate::schema::projects::dsl::{projects, workspace_id as project_workspace_id};
    let count: i64 = projects.filter(project_workspace_id.eq(workspace_id)).count().get_result(conn).unwrap_or(0);

    if max_projects > 0 && count >= max_projects {
        return Err(format!("Project quota exceeded for workspace {} (limit {})", workspace_id, max_projects));
    }
    Ok(())
}
