# feat: add distributed asynchronous SGD optimizer with parameter sharding

## Summary
- Adds distributed asynchronous SGD optimizer with parameter sharding and ring-allreduce gradients.
- Implements gradient staleness compensation and dynamic learning rate warmup.
- Adds distributed worker telemetry panel and benchmark tests.
