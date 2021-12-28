import { useState, useEffect, Fragment, useRef} from "react"
import { firestore } from '../lib/firebaseClient';
import { collection, QueryDocumentSnapshot, DocumentData, query, where, limit, getDocs, doc, getDoc, setDoc } from "@firebase/firestore";
import { Tab, Dialog, Transition, Listbox} from '@headlessui/react'
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from "../lib/supabaseClient";
import { TrashIcon, ExclamationIcon } from "@heroicons/react/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ApplicationView({ application, setListView }) {

    const [loading, setLoading] = useState(true)
    const [applicationData, setApplicationData] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

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
            <div className="flex items-center justify-between">
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
                <button
                    type="button"
                    onClick={() => {
                        setDeleteModalOpen(true)
                    }}
                    className="inline-flex items-center px-3 py-2 border border-red-600 border-2 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete Application
                </button>
                <DeleteModal open={deleteModalOpen} setOpen={setDeleteModalOpen} applicationId={application.id} />
            </div>
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
                                <EssaysView application={applicationData} applicationId={application.id} />
                            </Tab.Panel>
                            <Tab.Panel className="focus:outline-none">
                                <DocumentsView application={applicationData} applicationId={application.id} />
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

export const EssaysView = ({ application, applicationId }) => {
    return (
        <div>
            {application.essays.map((essay, essayIdx) => (
                <EssayComponent essay={essay} key = {essay.question} essayIdx={essayIdx} applicationId={applicationId}/>
            ))}
        </div>
    )
}

export const EssayComponent = ({ essay, applicationId, essayIdx }) => {

    const [originalAnswer, setOriginalAnswer] = useState(essay.answers[0])
    const [answers, setAnswers] = useState(essay.answers)
    const [answer, setAnswer] = useState(essay.answers[0])
    const [answerIdx, setAnswerIdx] = useState(0)
    const [count, setCount] = useState(essay.char_limit ? essay.answers[0].length : essay.answers[0].split(" ").length)
    // essay.char_limit ? essay.answers[0].length : essay.answers[0].split(" ").length
    const saveAnswer = async () => {
        const templateReference = doc(firestore, "applications", applicationId);
        const template = await getDoc(templateReference);
        const data = template.data();
        data.essays[essayIdx].answers[answerIdx] = answer;
        await setDoc(templateReference, data);
        toast("Saved!", { type: "success" })
        setAnswer(answer)
        setOriginalAnswer(answer)
    }

    return (
        <div className="mt-4">
            <h4 className="text-md font-medium mb-2">{essay.required ? <span className="text-red-600">Required: </span> : <></>} {essay.question} - Max {essay.limit} {essay.char_limit == true ? "Characters" : "Words"}</h4>
            <p className="text-sm mb-3">{essay.description}</p>
            <textarea
                rows={essay.char_limit ? 5 : essay.limit/15 > 5 ? essay.limit/15 : 5}
                id={essayIdx + "-essay"}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add your answer..."
                onChange={(e) => {
                    setAnswer(e.target.value)
                    setCount(essay.char_limit ? e.target.value.length : e.target.value.split(" ").length)
                }}
                defaultValue={answer}
            />
            <div className="mt-2 flex justify-end items-center">
            {/* <img src={"/git.svg"} alt="" className="flex-shrink-0 h-5 w-5 rounded-full" /> */}
                <select onChange = {
                    async (e) => {
                        if (e.target.value == "new") {
                            try {
                                const templateReference = doc(firestore, "applications", applicationId);
                                const template = await getDoc(templateReference);
                                const data = template.data();
                                data.essays[essayIdx].answers[answers.length] = "";
                                await setDoc(templateReference, data);
                                toast("Created New Version!", { type: "success" })
                                setAnswer("")
                                setOriginalAnswer("")
                                setAnswerIdx(answers.length)
                                // Rerender options list
                                const newTemplateReference = doc(firestore, "applications", applicationId);
                                const newTemplate = await getDoc(newTemplateReference);
                                const newData = newTemplate.data();
                                setAnswers(newData.essays[essayIdx].answers)
                                const elementId = essayIdx + "-essay"
                                document.getElementById(elementId).value = "Add your answer..."
                            } catch (err) {
                                toast(err.message, { type: "error" })
                            }
                        } else {
                            setAnswerIdx(parseInt(e.target.value))
                            setAnswer(answers[parseInt(e.target.value)])
                            setOriginalAnswer(answers[parseInt(e.target.value)])
                            const elementId = essayIdx + "-essay"
                            document.getElementById(elementId).value = answers[parseInt(e.target.value)]
                        }
                    }
                }
                    className="focus:outline-none relative inline-flex items-center rounded-md py-2 px-2 bg-gray-50 mr-4 text-sm font-medium text-gray-800 whitespace-nowrap hover:bg-gray-100 sm:px-4"
                >   
                
                    {answers.map((answer, idx) => (
                        <option key={idx} value={idx}>
                            Version {idx + 1}
                        </option>
                    ))}
                    <option value="new">Create a new version</option>
                </select>
                <p className="text-gray-500 font-medium">
                    <span className="text-sm"><span className={count > essay.limit ? "text-red-600" : ""}>{count}</span>/{essay.limit} {essay.char_limit == true ? "Characters" : "Words"} Used</span>
                </p>
                {
                    answer != originalAnswer ?

                    <button
                        type="submit"
                        onClick={() => {saveAnswer()}}
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

export const DeleteModal = ({ applicationId, open, setOpen }) => {

    const cancelButtonRef = useRef(null)

    const handleDelete = async () => {
        const { data, error } = await supabase
            .from('applications')
            .delete()
            .match({ id: applicationId })

        if (error) {
            toast(error.message, { type: "error" })
        } else {
            toast("Deleted!", { type: "success" })
            setOpen(false)
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                            Delete Application
                            </Dialog.Title>
                            <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this application? This action is irreverisble.
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => {handleDelete()}}
                        >
                        Delete Application
                        </button>
                        <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                        >
                        Cancel
                        </button>
                    </div>
                    </div>
                </Transition.Child>
                </div>
            </Dialog>
            </Transition.Root>
    )
}

export const DocumentsView = ({ application, applicationId }) => {

    const changeStatus = async (e) => {
        const templateReference = doc(firestore, "applications", applicationId);
        const template = await getDoc(templateReference);
        const data = template.data();
        data.documents[e.target.id.replace( /^\D+/g, '')].complete = e.target.checked;
        await setDoc(templateReference, data);
        toast("Saved!", { type: "success" })
    }

    return (
        <div className="flex flex-col focus:outline-none">
            <fieldset className="border-t border-b border-gray-200">
                <legend className="sr-only">Notifications</legend>
                    <div className="divide-y divide-gray-200">
                        {application.documents.map((document, index) => (
                            <label htmlFor={"document_" + index} key={index} className="relative flex items-start py-4 cursor-pointer">
                                <div className="min-w-0 flex-1 text-sm">
                                    <span className="font-medium text-gray-700">
                                    {document.type}
                                    </span>
                                    <p id="comments-description" className="text-gray-500">
                                    {document.required ? <>This is a <b className="text-gray-800">required</b> document</> : <>This is an optional document</>}
                                    </p>
                                </div>
                                <div className="ml-3 flex items-center h-5">
                                    <input
                                        id={"document_" + index}
                                        type="checkbox"
                                        defaultChecked={document.complete}
                                        onChange={changeStatus}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                </div>
                            </label>
                        ))}
                    </div>
                </fieldset>
            
        </div>
    )
}