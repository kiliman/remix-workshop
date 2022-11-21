import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import clsx from "clsx";
import qs from "qs";
import { useSpinDelay } from "spin-delay";
import { commitSession, getSession } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const session = await getSession(request.headers.get("cookie"));

  if (page < 4) {
    const data = session.get(`form-data-page-${page}`) ?? {};
    return json({ page, data });
  } else {
    // final page so just collect all the data to render
    const data = {
      ...session.get(`form-data-page-1`),
      ...session.get(`form-data-page-2`),
      ...session.get(`form-data-page-3`),
    };
    return json({ page, data });
  }
};

export const action = async ({ request }: LoaderArgs) => {
  const text = await request.text();
  // use qs.parse to support multi-value values (by email checkbox list)
  const { page, action, ...data } = qs.parse(text);
  const session = await getSession(request.headers.get("cookie"));
  session.set(`form-data-page-${page}`, data);

  const nextPage = Number(page) + (action === "next" ? 1 : -1);
  return redirect(`?page=${nextPage}`, {
    headers: {
      "set-cookie": await commitSession(session),
    },
  });
};

export default function Example() {
  const transition = useTransition();
  const showSpinner = useSpinDelay(transition.state !== "idle", {
    delay: 200,
    minDuration: 300,
  });

  const loaderData = useLoaderData();
  const page = Number(loaderData.page);
  const data = loaderData.data;

  return (
    <div className="container">
      <Form method="post" className="space-y-8 divide-y divide-gray-200">
        <input name="page" type="hidden" value={page} />
        <div className="pt-5 flex justify-between">
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold">
              Remix Multi-Page Form Example
            </h1>
            <Spinner visible={showSpinner} />
          </div>
          <div className="flex justify-end">
            {page > 1 && (
              <button
                name="action"
                value="previous"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Previous
              </button>
            )}
            {page < 4 && (
              <button
                name="action"
                value="next"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            )}
          </div>
        </div>
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          {page === 1 && (
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Username
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        workcation.com/
                      </span>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        defaultValue={data.username}
                        autoComplete="username"
                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    About
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <textarea
                      id="about"
                      name="about"
                      defaultValue={data.about}
                      rows={3}
                      className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Write a few sentences about yourself.
                    </p>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Photo
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                      <button
                        type="button"
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Change
                      </button>
                      <span className="ml-5 italic text-gray-500">
                        Not implemented
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Cover photo
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="hidden"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                        <p className="text-xs italic text-gray-500">
                          Not implemented
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {page === 2 && (
            <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Personal Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Use a permanent address where you can receive mail.
                </p>
              </div>
              <div className="space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    First name
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      name="firstName"
                      id="first-name"
                      defaultValue={data.firstName}
                      autoComplete="given-name"
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Last name
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      name="lastName"
                      id="last-name"
                      defaultValue={data.lastName}
                      autoComplete="family-name"
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Email address
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      id="email"
                      name="email"
                      defaultValue={data.email}
                      type="email"
                      autoComplete="email"
                      className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Country
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <select
                      id="country"
                      name="country"
                      defaultValue={data.country}
                      autoComplete="country-name"
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Street address
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      name="streetAddress"
                      defaultValue={data.streetAddress}
                      id="street-address"
                      autoComplete="street-address"
                      className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    City
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      name="city"
                      defaultValue={data.city}
                      id="city"
                      autoComplete="address-level2"
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    State / Province
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      name="region"
                      defaultValue={data.region}
                      id="region"
                      autoComplete="address-level1"
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    ZIP / Postal code
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      name="postalCode"
                      defaultValue={data.postalCode}
                      id="postal-code"
                      autoComplete="postal-code"
                      className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {page === 3 && (
            <div className="divide-y divide-gray-200 pt-8 space-y-6 sm:pt-10 sm:space-y-5">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Notifications
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  We'll always let you know about important changes, but you
                  pick what else you want to hear about.
                </p>
              </div>
              <div className="space-y-6 sm:space-y-5 divide-y divide-gray-200">
                <div className="pt-6 sm:pt-5">
                  <div role="group" aria-labelledby="label-email">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                      <div>
                        <div
                          className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                          id="label-email"
                        >
                          By Email
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg space-y-4">
                          <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="comments"
                                name="email"
                                value="comments"
                                defaultChecked={data.email?.includes(
                                  "comments"
                                )}
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="comments"
                                className="font-medium text-gray-700"
                              >
                                Comments
                              </label>
                              <p className="text-gray-500">
                                Get notified when someones posts a comment on a
                                posting.
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="relative flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="candidates"
                                  name="email"
                                  value="candidates"
                                  defaultChecked={data.email?.includes(
                                    "candidates"
                                  )}
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="candidates"
                                  className="font-medium text-gray-700"
                                >
                                  Candidates
                                </label>
                                <p className="text-gray-500">
                                  Get notified when a candidate applies for a
                                  job.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="relative flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="offers"
                                  name="email"
                                  value="offers"
                                  defaultChecked={data.email?.includes(
                                    "offers"
                                  )}
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="offers"
                                  className="font-medium text-gray-700"
                                >
                                  Offers
                                </label>
                                <p className="text-gray-500">
                                  Get notified when a candidate accepts or
                                  rejects an offer.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 sm:pt-5">
                  <div role="group" aria-labelledby="label-notifications">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                      <div>
                        <div
                          className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                          id="label-notifications"
                        >
                          Push Notifications
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="max-w-lg">
                          <p className="text-sm text-gray-500">
                            These are delivered via SMS to your mobile phone.
                          </p>
                          <div className="mt-4 space-y-4">
                            <div className="flex items-center">
                              <input
                                id="push-everything"
                                name="pushNotifications"
                                value="everything"
                                defaultChecked={
                                  data.pushNotifications === "everything"
                                }
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                              <label
                                htmlFor="push-everything"
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                Everything
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="push-email"
                                name="pushNotifications"
                                value="email"
                                defaultChecked={
                                  data.pushNotifications === "email"
                                }
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                              <label
                                htmlFor="push-email"
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                Same as email
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="push-nothing"
                                name="pushNotifications"
                                value="none"
                                defaultChecked={
                                  data.pushNotifications === "none"
                                }
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                              <label
                                htmlFor="push-nothing"
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                No push notifications
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {page === 4 && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
      </Form>
    </div>
  );
}

function Spinner({ visible }: { visible: boolean }) {
  return (
    <SpinnerIcon
      className={clsx("animate-spin transition-opacity", {
        "opacity-0": !visible,
        "opacity-100": visible,
      })}
    />
  );
}

export function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} fill="none" {...props}>
      <path
        d="M12 4.75v1.5M17.127 6.873l-1.061 1.061M19.25 12h-1.5M17.127 17.127l-1.061-1.061M12 17.75v1.5M7.934 16.066l-1.06 1.06M6.25 12h-1.5M7.934 7.934l-1.06-1.06"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
