import { supabase } from "../lib/supabaseClient"
import { useState, useEffect } from "react"
import ApplicationView from "./ApplicationView"
import { PlusCircleIcon } from "@heroicons/react/solid"

export default function ApplicationsListView({ applications, setChooseUniversities }) {

    const [loading, setLoading] = useState(true)
    const [applicationList, setApplicationList] = useState([])

    useEffect(async () => {
        const user = supabase.auth.user()
        
        const { data, error } = await supabase
            .from("applications")
            .select(`
                id,
                status,
                program (
                    name,
                    university (
                        id,
                        name,
                        city,
                        country
                    )
                )
            `)
            .eq("user", user.id)

        if (error) {
            console.error(error)
            setLoading(false)
        } else {
            setApplicationList(data)
            setLoading(false)
        }
    }, [])

    return (
        <div>
            { loading ? 

            <div>
                <h2 className="text-xl font-bold">Your Applications</h2>
            </div>

            :

            <>
                <ApplicationsView applications={applicationList} setChooseUniversities = {setChooseUniversities} />
                {/* <SecondaryApplicationsView /> */}
            </>
            }
        </div>
    )
}

export const ApplicationsView = ({ applications, setChooseUniversities }) => {

    const [applicationItem, setApplicationItem] = useState(null)
    const [listView, setListView] = useState(true)
    
    return (
        <div className="">
            {
                listView ?

                <div className="grid grid-cols-1 gap-4">
                    <h2 className="text-xl font-bold">Your Applications</h2>
                    {applications.map((application) => (
                        <ApplicationCard application={application} key = {application.id} setApplicationItem = {setApplicationItem} setListView={setListView} />
                    ))}
                    <p
                        onClick={() => setChooseUniversities(true)}
                        className="text-center text-gray-800 cursor-pointer font-semibold text-sm flex justify-center items-center hover:text-gray-500"
                    >
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Add another application
                    </p>
                </div>

                :

                <ApplicationView application={applicationItem} setListView = {setListView} />
            }
        </div>
    )
}

export const ApplicationCard = ({ application, setApplicationItem, setListView }) => {

    return (
        <div 
            onClick={() => {
                setListView(false)
                setApplicationItem(application)
            }}
            className="sm:hover:border-gray-300 hover:border-gray-600 border border-gray-300 rounded-lg p-4 flex items-center sm:justify-between">
            <div className="flex">
                <div className="w-10 flex items-center justify-center">
                    <img className="h-10 sm:block hidden" src = {`https://pamyiidbjyfvqvkglyiw.supabase.in/storage/v1/object/public/logos/${application.program.university.id}.png`} />
                </div>
                <div className="flex flex-col ml-2">
                    <h3 className="text-md font-medium items-center">
                        {application.program.name}
                        <span className={
                            application.status == "Completed" ?

                            "ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"

                            : application.status == "In Progress" ?

                            "ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"

                            : application.status == "Not Started" ?

                            "ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"

                            :

                            "ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        }>
                            {application.status}
                        </span>
                    </h3>
                    <p className="text-sm font-regular text-gray-500">{application.program.university.name}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => {
                    setApplicationItem(application)
                }}
                className="hidden sm:block inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Manage Application &rarr;
            </button>
        </div>
    )
}

export const ManageApplicationButton = ({ application, setApplicationItem }) => {

    const [loading, setLoading] = useState(false)

    return (
        <button
            type="button"
            onClick={() => {
                setLoading(true)
                setApplicationItem(application)
            }}
            className="hidden sm:block inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            { loading ? "Loading Application..." : <>Manage Application &rarr;</>};
        </button>
    )
}

export const SecondaryApplicationsView = () => {

    const [secondaryApplications, setSecondaryApplications] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchSecondaryApplications = async () => {
        const user = supabase.auth.user()

        const { data, error } = await supabase
            .from("secondary_applications")
            .select()
            .eq("user", user.id)

        if (error) {
            console.error(error)
        } else {
            setSecondaryApplications(data)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSecondaryApplications()
    }, [])

    return (
        <div className="">
            <h2 className="text-xl font-bold">Common and Coalition App Essays</h2>
            {
                loading ?

                <div>Loading...</div>

                :

                <>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        {secondaryApplications.map((essay) => (
                            <EssayCard essay={essay} key = {essay.id} />
                        ))}
                    </div>
                    <div className="mt-4"/>
                    {
                        secondaryApplications.length < 2 ?

                        <p
                            onClick={() => {}}
                            className="text-center text-gray-800 cursor-pointer font-semibold text-sm flex justify-center items-center hover:text-gray-500"
                        >
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            Add another essay
                        </p>

                        :

                        <></>
                    }
                </>
            }
            
        </div>
    )
}

export const EssayCard = ({ essay }) => {

    return (
        <div 
            onClick={() => {
            }}
            className="sm:hover:border-gray-300 hover:border-gray-600 border border-gray-300 rounded-lg p-4 flex items-center sm:justify-between">
            <div className="flex items-center">
                <img className="w-20 sm:block hidden" src = {`https://pamyiidbjyfvqvkglyiw.supabase.in/storage/v1/object/public/secondary-applications/${essay.type}`} />
                <div className="flex flex-col ml-4">
                    <h3 className="text-md font-medium">
                        {essay.type} Essay
                    </h3>
                </div>
            </div>
            <button
                type="button"
                onClick={() => {
                }}
                className="hidden sm:block inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Edit Essay &rarr;
            </button>
        </div>
    )
}