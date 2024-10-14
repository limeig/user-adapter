import * as sdk from "@basaldev/blocks-backend-sdk";
import { connectDb } from "../helpers";
import { Collections } from "../constant";
import { ObjectId } from 'mongodb';

class ChildEntity implements sdk.mongo.BaseMongoEntity {
    constructor(
        public first_name?: string,
        public birthday?: string,
        public Subjects?: Array<string>,
        public Parent?: string,
        public Reviews?: Array<string> | undefined
    ) {
    }

    _id: ObjectId;
    createdAt: Date;
    delFlg: 0 | 1;
    id: string;
    updatedAt: Date;
}

class ReviewEntity extends sdk.mongo.BaseMongoEntity {
    constructor(
        public date?: string,
        public Subject?: string,
        public Child?: string,
        public hours?: string,
        public Task?: string,
        public Asessment?: Array<string> | undefined
    ) {
        super();
    }
}

class TaskEntity extends sdk.mongo.BaseMongoEntity {
    constructor(
        public Child?: string,
        public date?: string,
        public Subject?: string,
        public isCompleted?: boolean,
        public isActive?: boolean,
        public Review?: string
    ) {
        super();
    }
}

export async function get_children_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        let db = await connectDb();
        const result = await sdk.mongo.find(logger, db, Collections.childrenCollection, { Parent: context.query["parent_id"] });
        return {
            data: result,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}

export async function get_subjects_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        let db = await connectDb();
        const result = await sdk.mongo.aggregate(logger, db, Collections.subjectCollection, [
            {
                $lookup:
                {
                    from: Collections.categoryCollection,
                    localField: 'category_id',
                    foreignField: 'id',
                    as: 'category'
                }
            }
        ]);

        return {
            data: result,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}

export async function create_child_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        const childObjectEntity: ChildEntity = new ChildEntity(
            context.body["child_first_name"],
            context.body["child_birthday"],
            context.body["subjects_ids"],
            context.body["parent_id"],
            undefined
        );

        let db = await connectDb();
        const { id } = await sdk.mongo.create<ChildEntity>(
            logger,
            db,
            Collections.childrenCollection,
            childObjectEntity
        );

        let parent_id = { id: context.body["parent_id"] };

        await sdk.mongo.updateMany(
            logger,
            db,
            Collections.userCollection,
            parent_id,
            {
                $addToSet: {
                    Children: id
                }
            }
        );
        return {
            data: id,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 200
        };
    }
}

export async function get_reviews_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        let query = {
            Subject: context.query["subject_id"],
            Child: context.query["child_id"]
        };

        let db = await connectDb();
        const result = await sdk.mongo.find(logger, db, Collections.reviewCollection, query);
        return {
            data: result,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}

export async function add_review_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        const reviewObjectEntity: ReviewEntity = new ReviewEntity(
            context.body["date"],
            context.body["subject_id"],
            context.body["duration"],
            context.body["child_id"],
            context.body["task_id"],
            undefined
        );
        
        let db = await connectDb();
        const id = await sdk.mongo.create(
            logger,
            db,
            Collections.reviewCollection,
            reviewObjectEntity);

        let child_id = { id: context.body["child_id"] };

        await sdk.mongo.updateMany(
            logger,
            db,
            Collections.childrenCollection,
            child_id, {
            $addToSet: {
                Reviews: id
            }
        });
        return {
            data: id,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}

export async function add_task_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        const taskEntity: TaskEntity = new TaskEntity(
            context.body["child_id"],
            context.body["date"],
            context.body["subject_id"],
            context.body["is_completed"],
            true,
            undefined
        );

        let db = await connectDb();
        const id = await sdk.mongo.create(
            logger,
            db,
            Collections.taskCollection,
            taskEntity);

        return {
            data: id,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}

export async function complete_task_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        let db = await connectDb();
        let task_id = { id: context.body["task_id"] };

        await sdk.mongo.updateMany(
            logger,
            db,
            Collections.taskCollection,
            task_id, {
            $set: {
                isCompleted: true
            }
        });

        return {
            data: task_id.id,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}

export async function deactivate_task_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        let db = await connectDb();
        let task_id = { id: context.body["task_id"] };

        await sdk.mongo.updateMany(
            logger,
            db,
            Collections.taskCollection,
            task_id, {
            $set: {
                isActive: false
            }
        });

        return {
            data: task_id.id,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}

export async function complete_active_tasks_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        let db = await connectDb();
        let query = { Child: context.body["child_id"],
                      isActive : true };

        const number = await sdk.mongo.updateMany(
            logger,
            db,
            Collections.taskCollection,
            query, {
            $set: {
                isCompleted: true,
                isActive: false
            }
        });

        return {
            data: number,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}

export async function get_tasks_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        let db = await connectDb();
        let query = { Child: context.query["child_id"] } as any;

        if (context.query["is_active"])
            query.isActive = context.body["is_active"]

        if (context.query["subject_id"])
            query.Subject = context.body["subject_id"]

        const result = await sdk.mongo.find(
            logger,
            db,
            Collections.taskCollection,
            query
        );
        return {
            data: result,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}