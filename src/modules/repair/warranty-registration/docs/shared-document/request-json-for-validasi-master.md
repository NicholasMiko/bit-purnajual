
==*syarat suatu master boleh dipakai di master/trx lain : exists, active, not deleted, status APPROVED dan complete true*==
==*note : replace XXX~uuid dengan value yang ingin dicari*==

```json
{
        "requestType": "ALL",
        "size": 15,
        "page": 1,
        "sortBy": {},
        "filterBy": {
                "id": [
                        "XXX~uuid"
                ],
                "active": true,
                "deleted": false,
                "status": "APPROVED",
                "complete": true
        }
}
```


