/*
 * Copyright 2022 Readium Foundation. All rights reserved.
 * Use of this source code is governed by the BSD-style license
 * available in the top-level LICENSE file of the project.
 */

package org.readium.adapters.pspdfkit.navigator

import android.graphics.PointF
import com.pspdfkit.configuration.PdfConfiguration
import org.readium.r2.navigator.SimplePresentation
import org.readium.r2.navigator.VisualNavigator
import org.readium.r2.navigator.input.TapEvent
import org.readium.r2.navigator.pdf.PdfDocumentFragmentInput
import org.readium.r2.navigator.pdf.PdfEngineProvider
import org.readium.r2.navigator.preferences.Axis
import org.readium.r2.navigator.util.SingleFragmentFactory
import org.readium.r2.navigator.util.createFragmentFactory
import org.readium.r2.shared.ExperimentalReadiumApi
import org.readium.r2.shared.publication.Metadata
import org.readium.r2.shared.publication.Publication
import org.readium.r2.shared.resource.Resource
import org.readium.r2.shared.util.Url

/**
 * Main component to use the PDF navigator with PSPDFKit.
 *
 * Provide [PsPdfKitDefaults] to customize the default values that will be used by
 * the navigator for some preferences.
 */
@ExperimentalReadiumApi
public class PsPdfKitEngineProvider(
    private val defaults: PsPdfKitDefaults = PsPdfKitDefaults(),
    private val listener: Listener? = null
) : PdfEngineProvider<PsPdfKitSettings, PsPdfKitPreferences, PsPdfKitPreferencesEditor> {

    public interface Listener : PdfEngineProvider.Listener {

        /** Called when configuring a new PDF fragment. */
        public fun onConfigurePdfView(builder: PdfConfiguration.Builder): PdfConfiguration.Builder = builder
    }

    override fun createDocumentFragmentFactory(
        input: PdfDocumentFragmentInput<PsPdfKitSettings>
    ): SingleFragmentFactory<PsPdfKitDocumentFragment> =
        createFragmentFactory {
            PsPdfKitDocumentFragment(
                publication = input.publication,
                href = input.href,
                initialPageIndex = input.pageIndex,
                initialSettings = input.settings,
                listener = object : PsPdfKitDocumentFragment.Listener {
                    override fun onResourceLoadFailed(href: Url, error: Resource.Exception) {
                        input.navigatorListener?.onResourceLoadFailed(href, error)
                    }

                    override fun onConfigurePdfView(builder: PdfConfiguration.Builder): PdfConfiguration.Builder =
                        listener?.onConfigurePdfView(builder) ?: builder

                    override fun onTap(point: PointF): Boolean =
                        input.inputListener?.onTap(TapEvent(point)) ?: false
                }
            )
        }

    override fun computeSettings(metadata: Metadata, preferences: PsPdfKitPreferences): PsPdfKitSettings {
        val settingsPolicy = PsPdfKitSettingsResolver(metadata, defaults)
        return settingsPolicy.settings(preferences)
    }

    override fun computePresentation(settings: PsPdfKitSettings): VisualNavigator.Presentation =
        SimplePresentation(
            readingProgression = settings.readingProgression,
            scroll = settings.scroll,
            axis = if (settings.scroll) settings.scrollAxis else Axis.HORIZONTAL
        )

    override fun createPreferenceEditor(
        publication: Publication,
        initialPreferences: PsPdfKitPreferences
    ): PsPdfKitPreferencesEditor =
        PsPdfKitPreferencesEditor(
            initialPreferences = initialPreferences,
            publicationMetadata = publication.metadata,
            defaults = defaults
        )

    override fun createEmptyPreferences(): PsPdfKitPreferences =
        PsPdfKitPreferences()
}
