-- Vérifier l'état des services pour debugging
SELECT 
    u.companyName,
    s.name as serviceName,
    us.isActive as serviceActive,
    tw.slug as websiteSlug,
    tw.isActive as websiteActive
FROM User u
JOIN UserService us ON u.id = us.userId
JOIN Service s ON us.serviceId = s.id
LEFT JOIN TenantWebsite tw ON u.id = tw.userId AND s.id = tw.serviceId
WHERE u.role = 'CLIENT'
ORDER BY u.companyName, s.name;