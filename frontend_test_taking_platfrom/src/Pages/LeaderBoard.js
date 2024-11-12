import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

const Leaderboard = () => {
  // Sample student data (name and score)
  const students = [
    { name: 'Alice', score: 85 },
    { name: 'Bob', score: 92 },
    { name: 'Charlie', score: 78 },
    { name: 'David', score: 95 },
    { name: 'Emma', score: 88 },
    { name: 'Frank', score: 81 },
    { name: 'Grace', score: 90 },
    { name: 'Hannah', score: 86 },
    { name: 'Ivy', score: 89 },
    { name: 'Jack', score: 93 },
  ];

  // Get the top 10 students based on score
  const topStudents = students
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <Box sx={{ p: 3, borderRadius: '12px', boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: '#004d4b', fontWeight: 'bold' }}>
        Leaderboard - Top 10 Students
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: '10px', overflow: 'hidden', boxShadow: 5 }}>
        <Table>
          <TableHead sx={{ background: 'linear-gradient(90deg, #42a5f5, #004d4b)' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Rank</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topStudents.map((student, index) => (
              <TableRow
                key={student.name}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f1f1f1',
                    cursor: 'pointer',
                  },
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f8f8',
                  borderBottom: '2px solid #e0e0e0',
                }}
              >
                <TableCell sx={{ fontWeight: 'bold', color: '#004d4b' }}>{index + 1}</TableCell>
                <TableCell sx={{ display: 'flex', alignItems: 'center', color: '#004d4b' }}>
                  {index < 3 ? (
                    <Star sx={{ color: '#FFD700', marginRight: 1 }} />
                  ) : (
                    <StarBorder sx={{ color: '#FFD700', marginRight: 1 }} />
                  )}
                  {student.name}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#004d4b' }}>{student.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Leaderboard;
