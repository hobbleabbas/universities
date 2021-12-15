import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react/cjs/react.development";
import { supabase } from "../lib/supabaseClient";

export default function ChooseUniversitiesView() {

    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [applicationsLength, setApplicationsLength] = useState(0)

    useEffect(async () => {
        const { data, error } = await supabase
            .from('universities')
            .select()
        
        if (error) {
            console.log(error);
            setLoading(false);
        } else {
            setUniversities(data);
            console.log(data)
            setLoading(false);
        }
    }, []);

    return (
        <div>
            {
                loading ? 

                <p>Loading...</p>

                :

                <div>
                    <h2 className="text-xl font-bold">Choose Your Universities</h2>
                    <div className="mt-4"/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {universities.map((university) => (
                            <UniversityCard key={university.id} applications={applications} setApplications={setApplications} university={university} setApplicationsLength={setApplicationsLength} />
                        ))}
                    </div>
                    {
                        applicationsLength == 0 ?

                        <p>Please select at least one university to continue</p>

                        :

                        <p>Continue bruh</p>
                    }
                </div>
            }
        </div>
    )
}

export const UniversityCard = ({ university, applications, setApplications, setApplicationsLength }) => {

    const [selected, setSelected] = useState(false);

    return (
        <div key={university.id} className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
            <div className="flex">
                <img className="w-10" src = {`https://yydpkixeytdubslvxpwt.supabase.in/storage/v1/object/public/logos/${university.id}.png`} />
                <div className="flex flex-col ml-2">
                    <h3 className="text-md font-medium">{university.name}</h3>
                    <p className="text-sm font-regular text-gray-500">{university.city}, {university.country}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => {
                    if (applications.includes(university.id)) {
                        const index = applications.indexOf(university.id);
                        if (index > -1) {
                            applications.splice(index, 1);
                        }
                        setApplications([...applications]);
                        setApplicationsLength(applications.length);
                        setSelected(false)
                    } else {
                        applications.push(university.id)
                        setApplications([...applications])
                        setApplicationsLength(applications.length)
                        setSelected(true)
                    }
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {
                    selected ?
                    
                    <span className="flex items-center">
                        <CheckCircleIcon className="text-green-600 w-5 h-5 mr-2" />
                        Selected
                    </span>

                    :

                    <span className="flex items-center">
                        <PlusCircleIcon className="text-gray-600 w-5 h-5 mr-2" />
                        Select
                    </span>
                }
            </button>
        </div>
    )
}