/**
 * Reports Web Vitals metrics for performance monitoring.
 * Can send to analytics services (Google Analytics, Sentry, etc.)
 */

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

/**
 * Enhanced Web Vitals reporter that sends to multiple services
 * @param {Object} metric - Web Vitals metric object
 */
export const reportWebVitalsEnhanced = (metric) => {
  // Send to Google Analytics (if available)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Send to Sentry (if available)
  try {
    const Sentry = require('@sentry/react');
    if (Sentry && Sentry.metrics) {
      Sentry.metrics.distribution(metric.name, metric.value, {
        unit: metric.rating === 'good' ? 'millisecond' : undefined,
        tags: {
          id: metric.id,
          rating: metric.rating,
        },
      });
    }
  } catch {
    // Sentry not available, ignore
  }
};

export default reportWebVitals;
