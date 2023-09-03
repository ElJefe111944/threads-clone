'use server'

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
}: Params): Promise<void> {

    connectToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                path,
                onboarded: true,
            },
            { upsert: true } // update & insert
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }

    } catch (error) {
        throw new Error(`Failed to create/update user: ${error}`);
    }
};

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        return await User
            .findOne({ id: userId })
        // .populate({})
    } catch (error) {
        throw new Error(`Failed to fetch usser: ${error}`)
    }
};

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();

        // TODO - Populate community 

        // find all threads authored by user with user id
        const threads = await User.findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            });

        return threads;

    } catch (error) {
        throw new Error(`Failed to fetch user post: ${error}`);
    }
};

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
} : {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder,
}){
    try {

        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, 'i');

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId },
        };

        if(searchString.trim() !== ''){
            query.$or = [
                { username: { $regrex: regex } },
                { name: { $regrex: regex } },
            ]
        };

        const sortOptions = { createdAt: sortBy };

        const userQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        // for total number of pages for user 
        const totalUserCount = await User.countDocuments(query);
        const users = await userQuery.exec();

        const isNext = totalUserCount > skipAmount + users.length;

        return { users, isNext };

    }catch (error){
        throw new Error(`Failed to fetch users: ${error}`);
    }
};

export async function getActivity(userId: string){

    try {
        connectToDB();

        // find all threads created by user 
        const userThreads = await Thread.find({ author: userId });

        // collect all the child thread ids (replies) from 'children' field
        const childThreadsIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, []);

        // collect all replies 
        const replies = await Thread.find({
            _id: { $in: childThreadsIds },
            author: { $ne: userId }
        }).populate({
            path: 'author',
            model: User,
            select: 'name image_id'
        })

        return replies;


    } catch(error){
        throw new Error(`Failed to fect activity: ${error}`);
    }
};