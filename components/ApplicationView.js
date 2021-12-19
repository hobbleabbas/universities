import { useState, useEffect } from "react"
import { firestore } from '../lib/firebaseClient';
import { collection, QueryDocumentSnapshot, DocumentData, query, where, limit, getDocs, doc, getDoc, setDoc } from "@firebase/firestore";
import { Fragment } from 'react'
import { Tab } from '@headlessui/react'

export default function ApplicationView({ application, setListView }) {

    const [loading, setLoading] = useState(true)
    const [applicationData, setApplicationData] = useState(null)

    useEffect(async () => {
        const data = await fetchApplication(application.id)
        setApplicationData(data)
        setLoading(false)
    }, [])

    const fetchApplication = async (application_id) => {
        const templateReference = doc(firestore, "applications", application_id);
        const template = await getDoc(templateReference);
        
        return template.data();
    }

    return (
        <div>
            <p onClick={()=>{setListView(true)}} className="cursor-pointer underline font-medium mb-3 hover:text-gray-500">&larr; Go Back</p>
            <h2 className="text-xl font-bold flex items-center">
                Manage Application: {application.program.name}
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
            </h2>
            {
                loading ?

                <div>Loading...</div>

                :

                <div className="mt-4">
                    <Tab.Group>
                        <Tab.List className="w-full border p-1 rounded-lg border-gray-300 shadow-sm focus:outline-none">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={
                                            selected ? 'focus:outline-none bg-blue-100 rounded-md text-blue-600 font-semibold text-white p-2 w-1/3' : 'focus:outline-none bg-white rounded-md text-gray-600 font-semibold text-white p-2 w-1/3'
                                        }
                                    >
                                    Essays
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                            {({ selected }) => (
                                    <button
                                        className={
                                            selected ? 'focus:outline-none bg-blue-100 rounded-md text-blue-600 font-semibold text-white p-2 w-1/3' : 'focus:outline-none bg-white rounded-md text-gray-600 font-semibold text-white p-2 w-1/3'
                                        }
                                    >
                                    Documents
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                            {({ selected }) => (
                                    <button
                                        className={
                                            selected ? 'focus:outline-none bg-blue-100 rounded-md text-blue-600 font-semibold text-white p-2 w-1/3' : 'focus:outline-none bg-white rounded-md text-gray-600 font-semibold text-white p-2 w-1/3'
                                        }
                                    >
                                    Tables
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="focus:outline-none">
                            <Tab.Panel className="focus:outline-none">
                                <EssaysView application={applicationData} />
                            </Tab.Panel>
                            <Tab.Panel>
                                Coming soon!
                            </Tab.Panel>
                            <Tab.Panel>
                                Coming soon!
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            }
        </div>
    )
}

export const EssaysView = ({ application }) => {
    return (
        <div>
            {application.essays.map((essay) => (
                <EssayComponent essay={essay} key = {essay.question}/>
            ))}
        </div>
    )
}

export const EssayComponent = ({ essay }) => {

    const [originalAnswer, setOriginalAnswer] = useState(essay.answer)
    const [answer, setAnswer] = useState(essay.answer)
    const [count, setCount] = useState(essay.answer.length)

    return (
        <div className="mt-4">
            <h4 className="text-md font-medium mb-2">{essay.required ? <span className="text-red-600">Required: </span> : <></>} {essay.question} - Max {essay.limit} {essay.char_limit == true ? "Characters" : "Words"}</h4>
            <p className="text-sm mb-3">{essay.description}</p>
            <textarea
                rows={5}
                name="comment"
                id="comment"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add your comment..."
                onChange={(e) => {
                    setAnswer(e.target.value)
                    setCount(e.target.value.length)
                }}
                defaultValue={essay.answer}
            />
            <div className="mt-2 flex justify-end items-center">
                <p className="text-gray-500 font-medium">
                    <span className="text-sm">{count}/{essay.limit} {essay.char_limit == true ? "Characters" : "Words"} Used</span>
                </p>
                {
                    answer != originalAnswer ?

                    <button
                        type="submit"
                        className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Save
                    </button>

                    :

                    <></>
                }
            </div>
        </div>
    )
}