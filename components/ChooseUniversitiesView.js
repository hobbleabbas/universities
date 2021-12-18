import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react/cjs/react.development";
import { supabase } from "../lib/supabaseClient";
import { firestore } from '../lib/firebaseClient';
import { collection, QueryDocumentSnapshot, DocumentData, query, where, limit, getDocs, doc, getDoc, setDoc } from "@firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";

export default function ChooseUniversitiesView() {

    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [applicationsLength, setApplicationsLength] = useState(0)

    const [universitiesViewEnabled, setUniversitiesViewEnabled] = useState(true);
    const [programsViewEnabled, setProgramsViewEnabled] = useState(false);

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
                    
                    {   
                        universitiesViewEnabled && !programsViewEnabled ?

                        <></>

                        // <UniversitiesView universities={universities} applications={applications} setApplications={setApplications} applicationsLength={applicationsLength} setApplicationsLength={setApplicationsLength} setProgramsViewEnabled={setProgramsViewEnabled} setUniversitiesViewEnabled={setUniversitiesViewEnabled} />

                        : programsViewEnabled && !universitiesViewEnabled ?

                        <></>
                        // <ProgramsView applications={applications} />

                        :

                        <div></div>
                    }
                </div>
            }
        </div>
    )
}

// export const UniversitiesView = ({ universities, applications, setApplications, applicationsLength, setApplicationsLength, setProgramsViewEnabled, setUniversitiesViewEnabled }) => {
//     return (
//         <div>
//             <h2 className="text-xl font-bold">Choose Your Universities</h2>
//             <div className="mt-4"/>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {universities.map((university) => (
//                     <UniversityCard key={university.id} applications={applications} setApplications={setApplications} university={university} setApplicationsLength={setApplicationsLength} />
//                 ))}
//             </div>
//             <div className="mt-4 flex justify-center">
//                 {
//                     applicationsLength == 0 ?

//                     <p className="text-sm font-medium text-gray-400">Please select at least one university to continue</p>

//                     :

//                     <button
//                         type="button"
//                         onClick={() => {
//                             setUniversitiesViewEnabled(false)
//                             setProgramsViewEnabled(true)
//                         }}
//                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     >
//                         Continue &rarr;
//                     </button>
//                 }
//             </div>
//         </div>
//     )
// }
// export const ProgramsView = ({ applications }) => {

//     const [selectedTotal, setSelectedTotal] = useState(0);
//     const [selectedPrograms, setSelectedPrograms] = useState([]);
//     const router = useRouter();
//     const [loading, setLoading] = useState(false)

//     const addApplication = async (program) => {
        
//         // Create the application id
//         const application_id = uuidv4();

//         // Fetch the template
//         const template = await fetchTemplate(String(program.id));
//         const status = await createApplication(template, application_id);

//         if (status === true) {
//             // Add the application to the database
//             const { data, error } = await supabase
//                 .from('applications')
//                 .insert({
//                     id: application_id,
//                     program: 1,
//                     user: supabase.auth.user().id,
//                 })

//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log(data)

//                 // if (selectedPrograms.indexOf(program.id) == selectedPrograms.length - 1) {
//                 //     router.reload(window.location.pathname)
//                 // }
//             }
//         }

//     }

//     // Fetch the application template
//     const fetchTemplate = async (template_id) => {
//         const templateReference = doc(firestore, "templates", template_id);
//         const template = await getDoc(templateReference);
        
//         return template.data();
//     }

//     const createApplication = async (template, application_id) => {
//         await setDoc(doc(firestore, "applications", application_id), template);

//         return true;
//     }

//     const handleSubmit = async () => {
//         setLoading(true);
//         for (const program of selectedPrograms) {
//             await addApplication(program);
//         }

        
//     }

//     return (
//         <div>
//             <h2 className="text-xl font-bold">Choose Your Programs</h2>
//             <div className="mt-2"/>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {applications.map((application) => (
//                     <ProgramSelector key={application.id} university={application} selectedTotal={selectedTotal} setSelectedTotal={setSelectedTotal} selectedPrograms={selectedPrograms} setSelectedPrograms={setSelectedPrograms} />
//                 ))}
//             </div>

//             <div className="mt-4 flex justify-center">
//                 {
//                     selectedTotal != applications.length ?

//                     <p className="text-sm font-medium text-gray-400">Please select a program for every university to continue</p>

//                     :

//                     <button
//                         type="button"
//                         onClick={() => {
//                             handleSubmit()
//                         }}
//                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     >
//                         {
//                             loading ?
                            
//                             <span className="flex">
//                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                                 Getting Everything Ready...
//                             </span>

//                             :

//                             <>Continue &rarr;</>
//                         }
//                     </button>
//                 }
//             </div>
//         </div>
//     )
// }

// export const ProgramSelector = ({ university, selectedTotal, setSelectedTotal, setSelectedPrograms }) => {

//     const [programs, setPrograms] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchPrograms = async () => {
//         const { data, error } = await supabase
//             .from('programs')
//             .select(`
//                 id,
//                 name,
//                 university (
//                     name
//                 )
//                 `)
//             .eq('university', university)
        
//         if (error) {
//             console.error(error);
//             setLoading(false);
//         } else {
//             setPrograms(data);
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         fetchPrograms();
//     }, [university]);

//     return (
//         <div>
//             <h2 className="text-md font-medium">{ loading ? "Loading..." : programs[0].university.name}</h2>
//             {
            
//                 loading ?
            
//                 <p>Loading...</p>
            
//                 :
                
//                 <select 
//                     id="location"   
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                     onChange={(e) => {
//                         if (e.target.value != "NULL") {
//                             setSelectedTotal(selectedTotal + 1)
//                             setSelectedPrograms([...programs, e.target.value])
//                         }
//                     }}
//                 >
//                     <option value = "NULL">Select a program</option>
//                     {programs.map((program) => (
//                         <option key={program.id} value={program.id}>{program.name}</option>
//                     ))}
//                 </select>
//             }

//         </div>
//     )
// }

// export const UniversityCard = ({ university, applications, setApplications, setApplicationsLength }) => {

//     const [selected, setSelected] = useState(false);

//     return (
//         <div key={university.id} className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
//             <div className="flex">
//                 <img className="w-10" src = {`https://pamyiidbjyfvqvkglyiw.supabase.in/storage/v1/object/public/logos/${university.id}.png`} />
//                 <div className="flex flex-col ml-2">
//                     <h3 className="text-md font-medium">{university.name}</h3>
//                     <p className="text-sm font-regular text-gray-500">{university.city}, {university.country}</p>
//                 </div>
//             </div>
//             <button
//                 type="button"
//                 onClick={() => {
//                     if (applications.includes(university.id)) {
//                         const index = applications.indexOf(university.id);
//                         if (index > -1) {
//                             applications.splice(index, 1);
//                         }
//                         setApplications([...applications]);
//                         setApplicationsLength(parseInt(applications.length));
//                         setSelected(false)
//                     } else {
//                         applications.push(university.id)
//                         setApplications([...applications])
//                         setApplicationsLength(parseInt(applications.length))
//                         setSelected(true)
//                     }
//                 }}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//                 {
//                     selected ?
                    
//                     <span className="flex items-center">
//                         <CheckCircleIcon className="text-green-600 w-5 h-5 mr-2" />
//                         Selected
//                     </span>

//                     :

//                     <span className="flex items-center">
//                         <PlusCircleIcon className="text-gray-600 w-5 h-5 mr-2" />
//                         Select
//                     </span>
//                 }
//             </button>
//         </div>
//     )
// }