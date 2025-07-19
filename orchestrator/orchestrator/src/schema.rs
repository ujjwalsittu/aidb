// @generated automatically by Diesel CLI.

diesel::table! {
    plans (id) {
        id -> Text,
        name -> Text,
        quota_json -> Text,
        created_at -> Timestamp,
    }
}

diesel::table! {
    projects (id) {
        id -> Text,
        workspace_id -> Text,
        db_version -> Text,
        status -> Text,
        created_at -> Timestamp,
    }
}

diesel::table! {
    workspaces (id) {
        id -> Text,
        name -> Text,
        plan_id -> Text,
        created_at -> Timestamp,
    }
}

diesel::joinable!(projects -> workspaces (workspace_id));
diesel::joinable!(workspaces -> plans (plan_id));

diesel::allow_tables_to_appear_in_same_query!(
    plans,
    projects,
    workspaces,
);
