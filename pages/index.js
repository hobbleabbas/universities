import Head from 'next/head'
import AuthModal from '../components/AuthModal'
import { supabase } from '../lib/supabaseClient'
import { useState, useEffect } from 'react'
import EmptyState from '../components/EmptyState'
import ChooseUniversitiesView from '../components/ChooseUniversitiesView'
import ApplicationsListView from '../components/ApplicationsListView'
import Link from 'next/link'

export default function Home() {

  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [chooseUniversities, setChooseUniversities] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const user = supabase.auth.user()
    if (user) {
      setUser(user)
      fetchApplications()
    } else {
      setUser(null)
      setLoading(false)
    }
  }, [])

  const fetchApplications = async () => {

    const user = supabase.auth.user()

    const { data, error } = await supabase
      .from('applications')
      .select()
      .eq('user', user.id)
    
    if (error) {
      console.error(error)
      setLoading(false)
    } else {
      setApplications(data)
      setLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>University Applications</title>
        <meta name="description" content="Manage your university applications" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-full">
        <div className="bg-gray-800 pb-32">
          <header className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-white">University Applications</h1>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
              {/* MAIN CONTENT */}
            <div className="bg-white rounded-lg border border-gray-300 px-5 py-6 sm:px-6">
              {
                loading ?

                <div>Loading...</div>

                : user != null ?

                <div>
        
                  <div className="" />
                  {
                    applications.length && !chooseUniversities > 0 ?

                    <ApplicationsListView applications = {applications} setChooseUniversities={setChooseUniversities} />

                    : chooseUniversities ?

                    <ChooseUniversitiesView user = {user} setChooseUniversities={setChooseUniversities} />

                    :

                    <EmptyState setChooseUniversities={setChooseUniversities}/>
                  }
                </div>

                :

                <AuthModal />
              }
            </div>
          </div>
        </main>
        <p className='text-md font-medium text-center'>A <Link href = "https://www.hobble.ca"><a href = "https://www.hobble.ca" className='text-blue-600'>Hobbleabbas</a></Link> Production</p>
      </div>
    </div>
  )
}