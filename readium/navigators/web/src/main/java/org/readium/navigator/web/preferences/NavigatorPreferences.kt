package org.readium.navigator.web.preferences

import kotlinx.serialization.Serializable
import org.readium.r2.navigator.preferences.Configurable
import org.readium.r2.navigator.preferences.Fit
import org.readium.r2.navigator.preferences.ReadingProgression
import org.readium.r2.shared.ExperimentalReadiumApi

@Serializable
@ExperimentalReadiumApi
public data class NavigatorPreferences(
    val fit: Fit? = null,
    val readingProgression: ReadingProgression? = null,
    val spreads: Boolean? = null
) : Configurable.Preferences<NavigatorPreferences> {

    init {
        require(fit in listOf(null, Fit.CONTAIN, Fit.WIDTH, Fit.HEIGHT))
    }

    override operator fun plus(other: NavigatorPreferences): NavigatorPreferences =
        NavigatorPreferences(
            fit = other.fit ?: fit,
            readingProgression = other.readingProgression ?: readingProgression,
            spreads = other.spreads ?: spreads
        )
}
