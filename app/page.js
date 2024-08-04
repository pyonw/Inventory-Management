'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, TextField, Typography, Stack, Button } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setInventory(inventoryList);
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, bgcolor: "#f5f5f5", p: 3 }}>
      <Modal open={open} onClose={handleClose}>
        <Box 
          sx={{ 
            position: "absolute", 
            top: "50%", 
            left: "50%", 
            width: 400, 
            bgcolor: "background.paper", 
            border: "2px solid #000", 
            boxShadow: 24, 
            p: 4, 
            display: "flex", 
            flexDirection: "column", 
            gap: 3, 
            transform: "translate(-50%, -50%)",
            borderRadius: 2 
          }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined" 
              fullWidth 
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)} 
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}>Add</Button>
          </Stack>
        </Box>
      </Modal>

      <Box sx={{ width: "800px", mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Button 
          variant="contained" 
          onClick={handleOpen} 
          sx={{ flex: 1, mr: 1, bgcolor: "#1976d2", '&:hover': { bgcolor: "#115293" } }}>
          Add New Item
        </Button>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 2 }}
        />
      </Box>

      <Box sx={{ border: "1px solid #333", width: "800px", borderRadius: 2, bgcolor: "#fff", boxShadow: 2 }}>
        <Box 
          sx={{ 
            height: "100px", 
            bgcolor: "#1976d2", 
            display: 'flex', 
            alignItems: "center", 
            justifyContent: "center", 
            borderRadius: "8px 8px 0 0" 
          }}>
          <Typography variant='h2' color='#fff'>Inventory Items</Typography>
        </Box>
        <Stack 
          sx={{ 
            height: "300px", 
            spacing: 2, 
            overflow: "auto", 
            p: 2 
          }}>
          {
            filteredInventory.map(({ name, quantity }) => (
              <Box 
                key={name} 
                sx={{ 
                  width: "100%", 
                  minHeight: "150px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  bgcolor: "#e0e0e0", 
                  padding: 2, 
                  borderRadius: 2, 
                  mb: 1 
                }}>
                <Typography variant='h5' color='#333'>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                <Typography variant='h5' color='#333'>{quantity}</Typography>
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    onClick={() => { addItem(name) }}
                    sx={{ bgcolor: "#1976d2", '&:hover': { bgcolor: "#115293" } }}>
                    Add
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => { removeItem(name) }}
                    sx={{ bgcolor: "#d32f2f", '&:hover': { bgcolor: "#9a0007" } }}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  )
}
