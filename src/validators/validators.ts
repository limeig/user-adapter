import * as sdk from "@basaldev/blocks-backend-sdk";

export namespace get {
    export async function validate_parent_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        console.log("Params: ", context.params);
        if (!context.query['parent_id']) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'parent_id is required',
        });

        return 200;
    }

    export async function validate_subject_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.query["subject_id"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'subject_id is required',
        });

        return 200;
    }

    export async function validate_child_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.query["child_id"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'child_id is required',
        });

        return 200;
    }
}

export namespace post {
    export async function validate_parent_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["parent_id"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'parent_id is required',
        });

        return 200;
    }

    export async function validate_child_name(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["child_first_name"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'child_first_name is required',
        });

        return 200;
    }

    export async function validate_child_bday(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["child_birthday"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'child_birthday is required',
        });

        return 200;
    }

    export async function validate_child_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["child_id"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'child_id is required',
        });

        return 200;
    }

    export async function validate_subject_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["subject_id"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'subject_id is required',
        });

        return 200;
    }

    export async function validate_subject_list(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["subjects_ids"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'subjects_ids is required',
        });

        return 200;
    }

    export async function validate_date(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["date"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'date is required',
        });

        return 200;
    }
    export async function validate_duration(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["duration"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'duration is required',
        });

        return 200;
    }
    export async function validate_completed_flag(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["is_completed"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'is_completed is required',
        });

        return 200;
    }
    export async function validate_task_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["task_id"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'task_id is required',
        });

        return 200;
    }
}