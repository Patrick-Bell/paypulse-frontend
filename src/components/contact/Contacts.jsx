import React, { useState, useEffect, useRef } from "react"
import {
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Plus,
  MailIcon,
  PhoneCallIcon,
  Edit,
  Trash2,
  Contact,
} from "lucide-react"
import AddContact from "./AddContact"
import EditContact from "./EditContact"
import { deleteContact, getContacts, addContactToBook } from "../routes/ContactRoutes"
import Loader from "../loading/Loader"
import { toast } from "sonner"

const Contacts = () => {
  const [mode, setMode] = useState("list") // "list" | "add" | "edit"
  const [contacts, setContacts] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState(null)
  const menuRef = useRef(null)

  const fetchContacts = async () => {
    try {
      const response = await getContacts()
      setContacts(response)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [mode]) // re-fetch after adding or editing

  const removeContact = async (id) => {
    try {
      await deleteContact(id)
      setContacts((prevContacts) => prevContacts.filter((c) => c.id !== id))
      toast.success("Contact deleted successfully!", {
        description: "The contact has been removed from your list.",
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleMenuToggle = (contactId, event) => {
    event.stopPropagation()
    setActiveMenu(activeMenu === contactId ? null : contactId)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null)
      }
    }
    if (activeMenu !== null) {
      document.addEventListener("click", handleClickOutside)
    }
    return () => document.removeEventListener("click", handleClickOutside)
  }, [activeMenu])

  if (loading) return <Loader />

  const ActionMenu = ({ contact, isActive }) => (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => handleMenuToggle(contact.id, e)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

      {isActive && (
        <div className="absolute right-0 top-full mt-1 w-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => {
              setSelectedContact(contact)
              setMode("edit")
              setActiveMenu(null)
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => removeContact(contact.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={() => addContactToBook(contact.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
          >
            <Contact className="w-4 h-4" />
            Add to Contacts
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-2xl mt-2">
      {mode === "add" && (
        <AddContact setOpen={() => setMode("list")} />
      )}

      {mode === "edit" && selectedContact && (
        <EditContact
          contact={selectedContact}
          setSelectedContact={setSelectedContact}
          setOpen={() => setMode("list")}
          onClose={() => {
            setSelectedContact(null)
            setMode("list")
          }}
        />
      )}

      {mode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {/* Add Contact Card */}
          <div
            onClick={() => setMode("add")}
            className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[280px]"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-gray-500 group-hover:bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200">
                <Plus className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-gray-500 text-lg mb-2 group-hover:text-blue-600">
                Add Contact
              </h3>
              <p className="text-gray-500 text-sm group-hover:text-blue-500">
                Click to add a new contact
              </p>
            </div>
          </div>

          {/* Contact Cards */}
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200"
            >
              <div className="relative z-10">
                {/* Avatar + Menu */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {contact.first_name[0]} {contact.last_name[0]}
                  </div>
                  <ActionMenu contact={contact} isActive={activeMenu === contact.id} />
                </div>

                {/* Contact Info */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {contact.first_name} {contact.last_name}
                  </h3>
                  <p className="text-blue-600 font-medium text-sm mb-1">{contact.role}</p>
                  <p className="text-gray-500 text-sm mb-2">{contact.company}</p>
                  <div className="flex items-center text-gray-400 text-xs mb-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {contact.location}
                  </div>
                  <div className="flex items-center text-gray-400 text-xs">
                    <MailIcon className="w-3 h-3 mr-1" />
                    {contact.email}
                  </div>
                  <div className="flex items-center text-gray-400 text-xs">
                    <PhoneCallIcon className="w-3 h-3 mr-1" />
                    {contact.phone}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm flex items-center justify-center space-x-1"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm flex items-center justify-center space-x-1"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Contacts
