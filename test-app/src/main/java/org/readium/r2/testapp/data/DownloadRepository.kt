/*
 * Copyright 2023 Readium Foundation. All rights reserved.
 * Use of this source code is governed by the BSD-style license
 * available in the top-level LICENSE file of the project.
 */

package org.readium.r2.testapp.data

import org.readium.r2.shared.util.AbsoluteUrl
import org.readium.r2.testapp.data.db.DownloadsDao
import org.readium.r2.testapp.data.model.Download

class DownloadRepository(
    private val type: Download.Type,
    private val downloadsDao: DownloadsDao
) {

    suspend fun all(): List<Download> =
        downloadsDao.getDownloads(type)

    suspend fun insert(
        id: String,
        cover: AbsoluteUrl?
    ) {
        downloadsDao.insert(
            Download(id = id, type = type, cover = cover?.toString())
        )
    }

    suspend fun remove(
        id: String
    ) {
        downloadsDao.delete(id, type)
    }

    suspend fun getCover(id: String): AbsoluteUrl? =
        downloadsDao.get(id, type)?.cover?.let { AbsoluteUrl(it) }
}
