import { supabase } from "../lib/supabaseClient"
import { useState, useEffect } from "react"

export default function ApplicationsListView({ applications }) {

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

            "Loading..."

            :

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {applicationList.map((application) => (
                    <ApplicationCard application={application} key = {application.id} />
                ))}
            </div>
            
            }
        </div>
    )
}

export const ApplicationCard = ({ application }) => {

    const [selected, setSelected] = useState(false)

    return (
        <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
            <div className="flex">
                <img className="w-10" src = {`https://pamyiidbjyfvqvkglyiw.supabase.in/storage/v1/object/public/logos/${application.program.university.id}.png`} />
                <div className="flex flex-col ml-2">
                    <h3 className="text-md font-medium items-center">
                        {application.program.university.name}
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
                    <p className="text-sm font-regular text-gray-500">{application.program.university.city}, {application.program.university.country}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => {
                    
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Manage Application &rarr;
            </button>
        </div>
    )
}