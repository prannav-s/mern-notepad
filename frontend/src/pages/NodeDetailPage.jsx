import { LoaderIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams, Link} from 'react-router'
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react';
import api from '../lib/axios.js';

const NodeDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error fetching note", error);
        toast.error("Failed to load the note");
      }
      finally {
        setLoading(false);
      }
    }
    fetchNote();
  }, [id]);

    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this note?")) {
          try {
              await api.delete(`/notes/${id}`);
              toast.success("Note deleted successfully");
              navigate("/");
              
          } catch (error) {
              toast.error("Failed to delete note");
              console.log("Error in handleDelete", error);
          }
      }
    };
  const handleSave = async () => {
    if (note.title.trim() === "" || note.content.trim() === "") {
      toast.error("Title or content cannot be empty");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to update note");
      console.log("Error in handleSave", error);
    }
    finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (<div className='min-h-screen bg-base-200 flex items-center justify-center'>
      <LoaderIcon className='size-10 text-primary animate-spin' />
    </div>);
  }

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to={"/"} className='btn btn-ghost'>
              <ArrowLeftIcon className='size-5' />
              Back
            </Link>
            <button className="btn btn-ghost btn-xs text-error" onClick={() => handleDelete(note._id)}>
              <Trash2Icon className="size-5"/>
            </button>
          </div>
          <div className="card bg-base-100">
            <div className="card-body">
              <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Title</span>
                </label>
                <input type="text" 
                placeholder='Enter title' 
                className='input input-bordered' 
                value={note.title} 
                onChange={(e) => setNote({ ...note, title: e.target.value })} />
                <label className='label'>
                  <span className='label-text'>Title</span>
                </label>
                <textarea 
                  placeholder='Write your note here...' 
                  className='textarea textarea-bordered h-32' 
                  value={note.content} 
                  onChange={(e) => setNote({ ...note, content: e.target.value })} />
              </div>
              <div className='card-actions justify-end'>
                <button 
                  className={`btn btn-primary ${saving ? 'loading' : ''}`}
                  onClick={ () => handleSave(note._id) }
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NodeDetailPage