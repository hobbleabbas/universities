import { Fragment } from 'react'
import { Tab } from '@headlessui/react'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { LockClosedIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'

export default function AuthModal() {
    return (
        <div>
            <Tab.Group>
                <Tab.List className="w-full border p-1 rounded-lg border-gray-300 shadow-sm focus:outline-none">
                    <Tab as={Fragment}>
                    {({ selected }) => (
                            <button
                                className={
                                    selected ? 'focus:outline-none bg-blue-100 rounded-md text-blue-600 font-semibold text-white p-2 w-1/2' : 'focus:outline-none bg-white rounded-md text-gray-600 font-semibold text-white p-2 w-1/2'
                                }
                            >
                            Log In
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={
                                    selected ? 'focus:outline-none bg-blue-100 rounded-md text-blue-600 font-semibold text-white p-2 w-1/2' : 'focus:outline-none bg-white rounded-md text-gray-600 font-semibold text-white p-2 w-1/2'
                                }
                            >
                            Sign Up
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels className="focus:outline-none">
                    <Tab.Panel>
                        <LogInView />
                    </Tab.Panel>
                    <Tab.Panel className="focus:outline-none">
                        <SignUpView />
                    </Tab.Panel>
                </Tab.Panels>
                </Tab.Group>
        </div>
    )
}

export const SignUpView = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    const signUp = async (e) => {

        e.preventDefault()
        setLoading(true)

        const { user, session, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) {
            setError(error.message)
            setLoading(false)
        }
        if (user) {
            router.reload(window.location.pathname)
        }
    }

    return (
        <form className='focus:outline-none' onSubmit={signUp}>
            <div className='mt-4 focus:outline-none' />
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
            </label>
            <div className="mt-1">
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div className='mt-4' />
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
            </label>
            <div className="mt-1">
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div className='mt-4' />
            <div className='flex justify-center'>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >   
                    <LockClosedIcon className="w-4 h-4 mr-2" />
                    {
                        loading ?

                        <span>Loading...</span>

                        :

                        <span>Create Account</span>
                    }
                </button>
            </div>
            {
                error ?

                <div className='mt-4 text-red-600 text-sm text-center'>
                    {error}
                </div>

                :

                <></>
            }
        </form>
    )
}

export const LogInView = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    const signIn = async (e) => {

        e.preventDefault()
        setLoading(true)

        const { user, session, error } = await supabase.auth.signIn({
            email: email,
            password: password,
        })
        if (error) {
            setError(error.message)
            setLoading(false)
        }
        if (user) {
            router.reload(window.location.pathname)
        }
    }

    return (
        <form className='focus:outline-none' onSubmit={signIn}>
            <div className='mt-4 focus:outline-none' />
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
            </label>
            <div className="mt-1">
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div className='mt-4' />
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
            </label>
            <div className="mt-1">
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div className='mt-4' />
            <div className='flex justify-center'>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >   
                    <LockClosedIcon className="w-4 h-4 mr-2" />
                    {
                        loading ?

                        <span>Loading...</span>

                        :

                        <span>Log In</span>
                    }
                </button>
            </div>
            {
                error ?

                <div className='mt-4 text-red-600 text-sm text-center'>
                    {error}
                </div>

                :

                <></>
            }
        </form>
    )
}