import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Plus,
  MailIcon,
  PhoneCallIcon,
  Edit,
  Trash2,
  Contact
} from 'lucide-react';
import AddContact from './AddContact';
import { deleteContact, getContacts } from '../routes/ContactRoutes';
import Loader from '../loading/Loader';
import { toast } from 'sonner';
import { addContactToBook } from '../routes/ContactRoutes';
import EditContact from './EditContact'


const Contacts = () => {

  const [open, setOpen] = useState(false)
  const [contacts, setContacts] = useState([])
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is open
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState(null)
  const menuRef = useRef(null)



  const handleMenuToggle = (shiftId, event) => {
    event.stopPropagation(); // Prevent card click
    setActiveMenu(activeMenu === shiftId ? null : shiftId);
  };

  const fetchContacts = async () => {
    try{
    const response = await getContacts()
    setContacts(response)

    setLoading(false)

    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    fetchContacts();
  }, [open])

  const handleAddContact = () => {
    setOpen(true);
  }
  
  const removeContact = async (id) => {
    try{
      const response = await deleteContact(id)
      setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
      toast.success('Contact deleted successfully!', {
        description: 'The contact has been removed from your list.',
      });
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
  
    if (activeMenu !== null) {
      document.addEventListener('click', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenu]);

  if (loading) {
    return <Loader />
  }

  const ActionMenu = ({ contact, isActive }) => (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => handleMenuToggle(contact.id, e)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>
      
      {isActive && (
        <div className="absolute right-0 top-full mt-1 w-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-70">
          <button
            onClick={(e) => setSelectedContact(contact)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={(e) => removeContact(contact?.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={(e) => addContactToBook(contact?.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            <Contact className="w-4 h-4" />
            Add to Contacts
          </button>
        </div>
      )}
    </div>
  );


    return (

        <>

      <div className="bg-white rounded-2xl mt-2">
        {open ? (
          <AddContact setOpen={setOpen} />
        ):(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div 
             onClick={handleAddContact}
             className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[280px]"
         >
             <div onClick={() => setOpen(true)} className="flex flex-col items-center justify-center text-center">
                 <div className="w-14 h-14 bg-gray-500 group-hover:bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200">
                     <Plus className="w-7 h-7" />
                 </div>
                 <h3 className="font-semibold text-gray-500 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                     Add Contact
                 </h3>
                 <p className="text-gray-500 text-sm group-hover:text-blue-500 transition-colors">
                     Click to add a new contact to your network
                 </p>
             </div>
         </div>

          {selectedContact ? (
            <EditContact contact={selectedContact} setSelectedContact={setSelectedContact}/>
          ):(
            <>
             {contacts.map((contact) => (
   <div key={contact.id} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
     <div className="relative z-10">
       {/* Avatar and Favorite */}
       <div className="flex items-center justify-between mb-4">
         <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
           {contact.first_name[0]} {contact.last_name[0]}
         </div>
         <div className="flex items-center space-x-2">
           <ActionMenu contact={contact} isActive={activeMenu === contact.id} />
         </div>
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
         <a href={`tel:${contact.phone}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-1">
           <Phone className="w-4 h-4" />
           <a>Call</a>
         </a>
         <a href={`mailto:${contact.email}`} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-1">
           <Mail className="w-4 h-4" />
           <a>Email</a>
         </a>
       </div>

     </div>
   </div>
 ))}
            </>
          )}

</div>
        )}
         
          </div>
        
        </>
    )
}

export default Contacts