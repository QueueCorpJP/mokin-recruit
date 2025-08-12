#!/usr/bin/env node

const v8 = require('v8');
const os = require('os');

let peakHeapUsed = 0;

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function checkMemory() {
  const heapStats = v8.getHeapStatistics();
  const memUsage = process.memoryUsage();
  
  if (memUsage.heapUsed > peakHeapUsed) {
    peakHeapUsed = memUsage.heapUsed;
  }
  
  const report = {
    timestamp: new Date().toISOString(),
    process: {
      pid: process.pid,
      version: process.version,
      platform: process.platform,
      uptime: Math.floor(process.uptime()) + 's',
    },
    memory: {
      rss: formatBytes(memUsage.rss),
      heapTotal: formatBytes(memUsage.heapTotal),
      heapUsed: formatBytes(memUsage.heapUsed),
      external: formatBytes(memUsage.external),
      arrayBuffers: formatBytes(memUsage.arrayBuffers || 0),
      peakHeapUsed: formatBytes(peakHeapUsed),
    },
    v8: {
      totalHeapSize: formatBytes(heapStats.total_heap_size),
      totalHeapSizeExecutable: formatBytes(heapStats.total_heap_size_executable),
      totalPhysicalSize: formatBytes(heapStats.total_physical_size),
      totalAvailableSize: formatBytes(heapStats.total_available_size),
      usedHeapSize: formatBytes(heapStats.used_heap_size),
      heapSizeLimit: formatBytes(heapStats.heap_size_limit),
      mallocedMemory: formatBytes(heapStats.malloced_memory),
      peakMallocedMemory: formatBytes(heapStats.peak_malloced_memory),
    },
    system: {
      totalMemory: formatBytes(os.totalmem()),
      freeMemory: formatBytes(os.freemem()),
      loadAverage: os.loadavg(),
    },
  };
  
  // Check for potential memory leak
  const heapUsedPercent = (heapStats.used_heap_size / heapStats.heap_size_limit) * 100;
  
  if (heapUsedPercent > 90) {
    console.error('⚠️  WARNING: Heap usage above 90%!');
    console.error('   Consider restarting the application');
    
    // Force garbage collection if available
    if (global.gc) {
      console.log('   Running garbage collection...');
      global.gc();
    }
  }
  
  return report;
}

// Monitor memory every 30 seconds
if (require.main === module) {
  console.log('📊 Memory Monitor Started');
  console.log('   Monitoring every 30 seconds...\n');
  
  setInterval(() => {
    const report = checkMemory();
    console.log(JSON.stringify(report, null, 2));
    console.log('---');
  }, 30000);
  
  // Initial check
  const initialReport = checkMemory();
  console.log(JSON.stringify(initialReport, null, 2));
  console.log('---');
}

module.exports = { checkMemory, formatBytes };