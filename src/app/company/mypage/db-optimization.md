# Database Optimization Recommendations for Company MyPage

## Recommended Indexes for Performance

### Candidates Table
```sql
-- Primary query filters and sorting
CREATE INDEX CONCURRENTLY idx_candidates_status_login 
ON candidates(status, last_login_at DESC NULLS LAST) 
WHERE status = 'ACTIVE';

-- Birth date for age calculation
CREATE INDEX CONCURRENTLY idx_candidates_birth_date 
ON candidates(birth_date) 
WHERE birth_date IS NOT NULL;

-- Location-based filtering
CREATE INDEX CONCURRENTLY idx_candidates_prefecture 
ON candidates(prefecture) 
WHERE prefecture IS NOT NULL;
```

### Messages Table
```sql
-- Message status and timestamp optimization
CREATE INDEX CONCURRENTLY idx_messages_status_sent 
ON messages(status, sent_at DESC) 
WHERE status = 'SENT';

-- Subject filtering for priority messages
CREATE INDEX CONCURRENTLY idx_messages_subject_sent 
ON messages(sent_at DESC) 
WHERE subject IS NOT NULL AND status = 'SENT';

-- Company group relationship
CREATE INDEX CONCURRENTLY idx_messages_company_group 
ON messages(sender_company_group_id, sent_at DESC) 
WHERE sender_company_group_id IS NOT NULL;
```

### Related Tables
```sql
-- Education table for candidate joins
CREATE INDEX CONCURRENTLY idx_education_candidate_id 
ON education(candidate_id);

-- Work experience for industry data
CREATE INDEX CONCURRENTLY idx_work_experience_candidate_id 
ON work_experience(candidate_id);

-- Job type experience for skills data
CREATE INDEX CONCURRENTLY idx_job_type_experience_candidate_id 
ON job_type_experience(candidate_id);

-- Career status for selection companies
CREATE INDEX CONCURRENTLY idx_career_status_candidate_private 
ON career_status_entries(candidate_id, is_private) 
WHERE is_private = false;
```

## Query Performance Analysis

### N+1 Problem Prevention
✅ **Solved**: Single query with JOIN operations
- Candidates query includes all related tables in one SELECT
- Messages query includes company_groups and company_accounts joins
- No additional queries needed for each candidate/message item

### Efficient Data Retrieval
✅ **Optimized**: 
- LIMIT 10 for candidates reduces data transfer
- LIMIT 3 for messages keeps response size small
- Only necessary fields selected in each query
- NULL checks prevent unnecessary data processing

### Caching Strategy
✅ **Implemented**:
- Next.js unstable_cache with 5-minute TTL for candidates
- 1-minute TTL for messages (more frequent updates expected)
- Tagged cache for targeted invalidation

## Performance Monitoring

### Key Metrics to Track
1. **Query Execution Time**: Should be < 100ms for candidates, < 50ms for messages
2. **Database Connection Pool**: Monitor connection usage
3. **Cache Hit Rate**: Aim for > 80% cache hits during normal operation
4. **Memory Usage**: Monitor client-side state management

### Potential Future Optimizations
1. **Materialized Views**: For complex candidate recommendations
2. **Read Replicas**: For heavy read operations
3. **Connection Pooling**: Configure appropriate pool sizes
4. **Query Result Pagination**: Implement cursor-based pagination for scalability