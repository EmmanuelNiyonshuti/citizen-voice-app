import Complaint from '../models/complaint.js';

export const getComplaintStats = async (req, res) => {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

      const [
        totalComplaints,
        statusCounts,
        categoryCounts,
        recentComplaints,
        previousWeekComplaints,
        resolutionTimes
      ] = await Promise.all([
        // Total complaints
        Complaint.countDocuments(),
        
        // Status distribution
        Complaint.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        
        // Category distribution
        Complaint.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ]),
        
        // Recent complaints (last 7 days)
        Complaint.countDocuments({
          createdAt: { $gte: sevenDaysAgo }
        }),

        // Previous week complaints (7-14 days ago)
        Complaint.countDocuments({
          createdAt: {
            $gte: fourteenDaysAgo,
            $lt: sevenDaysAgo
          }
        }),

        // Average resolution time for resolved complaints
        Complaint.aggregate([
          {
            $match: {
              status: 'RESOLVED',
              'adminResponse.respondedAt': { $exists: true }
            }
          },
          {
            $project: {
              resolutionTime: {
                $divide: [
                  { $subtract: ['$adminResponse.respondedAt', '$createdAt'] },
                  1000 * 60 * 60 * 24 // Convert to days
                ]
              }
            }
          },
          {
            $group: {
              _id: null,
              averageTime: { $avg: '$resolutionTime' }
            }
          }
        ])
      ]);

      // Calculate weekly trend
      const weeklyTrend = previousWeekComplaints === 0 
        ? 100 // If no complaints last week, treat as 100% increase
        : ((recentComplaints - previousWeekComplaints) / previousWeekComplaints) * 100;

      // Convert status counts array to object with proper structure
      const statusDistribution = statusCounts.reduce((acc, curr) => {
        acc[curr._id.toLowerCase()] = curr.count;
        return acc;
      }, {
        pending: 0,
        in_review: 0,
        resolved: 0,
        rejected: 0
      });

      // Convert category counts array to object
      const categoryDistribution = categoryCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});

      // Calculate average resolution time (rounded to 1 decimal place)
      const averageResolutionTime = resolutionTimes.length > 0
        ? Math.round(resolutionTimes[0].averageTime * 10) / 10
        : 0;

      res.json({
        total: totalComplaints,
        pending: statusDistribution.pending || 0,
        inReview: statusDistribution.in_review || 0,
        resolved: statusDistribution.resolved || 0,
        rejected: statusDistribution.rejected || 0,
        recentComplaints,
        categoryDistribution,
        weeklyTrend: Math.round(weeklyTrend * 10) / 10, // Round to 1 decimal place
        averageResolutionTime
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics'
      });
    }
  }

export const exportComplaints = async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .select('-__v')
        .sort({ createdAt: -1 })
        .lean();
  
      // Convert complaints to CSV format
      const fields = [
        'ticketId',
        'fullName',
        'email',
        'category',
        'description',
        'location',
        'status',
        'createdAt',
        'adminResponse.message',
        'adminResponse.respondedAt'
      ];
  
      const csv = [
        // Header
        fields.join(','),
        // Data rows
        ...complaints.map(complaint => {
          return fields.map(field => {
            const value = field.includes('.')
              ? field.split('.').reduce((obj, key) => obj?.[key], complaint)
              : complaint[field];
            
            // Handle special cases and escape commas
            if (value === undefined || value === null) return '';
            if (value instanceof Date) return value.toISOString();
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',');
        })
      ].join('\n');
  
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=complaints.csv');
      res.send(csv);
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({
        success: false,
        message: 'Error exporting complaints'
      });
    }
  }
  