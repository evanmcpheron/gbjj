import { useState } from 'react'
import {
  Paper,
  Container,
  Button,
  LinearProgress,
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useDB } from '@renderer/context/db.context'
import { useNavigate } from 'react-router'

export const BackupView = () => {
  const { db } = useDB()
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const navigate = useNavigate()

  async function handleExport() {
    if (!db) return
    const dump = await db.exportJSON()
    const blob = new Blob([JSON.stringify(dump, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'backup_DO_NOT_DELETE.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  async function doImport() {
    if (!db || !importFile) return

    setImporting(true)
    try {
      await Promise.all(
        Object.values(db.collections).map(async (col) => {
          const docs = await col.find().exec()
          await Promise.all(docs.map((doc) => doc.remove()))
        })
      )

      const text = await importFile.text()
      const dump = JSON.parse(text)
      await db.importJSON(dump)
      navigate('/members')
    } catch (err) {
      console.error('Import failed', err)
    } finally {
      setImportFile(null)
      setImporting(false)
      setConfirmOpen(false)
    }
  }

  return (
    <Container maxWidth="md">
      <Paper variant="outlined" sx={{ mt: 4, p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h4" align="center">
            Backup & Restore
          </Typography>
          <Divider />

          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}
          >
            <Typography variant="h6" gutterBottom>
              Export Backup
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Download a JSON snapshot of your entire local database.
            </Typography>
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport}>
              Download Backup
            </Button>
          </Box>

          <Box
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}
          >
            <Typography variant="h6" gutterBottom>
              Restore Backup
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select a backup file to wipe and restore your database. This will overwrite all
              existing data.
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                disabled={importing}
              >
                Select File
                <input
                  hidden
                  accept="application/json"
                  type="file"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                />
              </Button>

              {importFile && <Chip label={importFile.name} color="primary" />}

              <Box sx={{ flexGrow: 1 }} />

              <Button
                variant="contained"
                color="error"
                onClick={() => setConfirmOpen(true)}
                disabled={!importFile || importing}
              >
                {importing ? 'Restoring…' : 'Start Restore'}
              </Button>
            </Stack>

            {importing && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
                  Wiping data and importing backup…
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Paper>

      {confirmOpen && (
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon color="warning" />
            Confirm Restore
          </DialogTitle>
          <DialogContent dividers>
            <Typography>
              This will <strong>erase all current data</strong> and restore from your selected
              backup. Are you sure you want to proceed?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={doImport} variant="contained" color="error" disabled={importing}>
              {importing ? 'Restoring…' : 'Yes, Restore'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  )
}
