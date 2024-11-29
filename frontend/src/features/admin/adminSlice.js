import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../auth/apiSlice"; 

const adminAdapter = createEntityAdapter({});

const initialState = adminAdapter.getInitialState();

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminInfo: builder.query({
      query: () => ({
        url: "/api/v1/staffs/admin",
        method: "GET",
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData.data;
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Staff", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Admin", id })),
          ];
        } else return [{ type: "Admin", id: "LIST" }];
      },
    }),
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: `/api/v1/auth/updatePassword/${passwordData.id}`,
        method: "PATCH",
        body: { ...passwordData },
      }),
    }),
    getStaffById: builder.query({
      query: (id) => ({ url: `/api/v1/staffs/${id}`, method: "GET" }),
      transformResponse: (responseData) => {
        responseData.id = responseData._id;
        return responseData;
      },
      providesTags: (result, error, arg) => [{ type: "Staff", id: arg }],
    }),

    addNewStaff: builder.mutation({
      query: (initialUserData) => ({
        url: "/api/v1/staffs",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "Staff", id: "LIST" }],
    }),
    updateStaff: builder.mutation({
      query: ({ id, ...patch }) => {
        console.log(id, patch);
        return {
          url: `/api/v1/staffs/${id}`,
          method: "PUT",
          body: patch,
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: "Staff", id: arg.id }],
    }),
    deleteStaff: builder.mutation({
      query: ({ id }) => ({
        url: `/api/v1/staffs`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Staff", id: arg.id }],
    }),
  }),
});

export const {
  useGetAdminInfoQuery,
  useUpdatePasswordMutation,
  useGetStaffByIdQuery,
  useAddNewStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = adminApiSlice;

// returns the query result object
export const selectAdminResult = adminApiSlice.endpoints.getStaffById.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectAdminResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = adminAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
