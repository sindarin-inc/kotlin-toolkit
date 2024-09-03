package org.readium.navigator.web.pager

import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.PagerDefaults
import androidx.compose.foundation.pager.PagerScope
import androidx.compose.foundation.pager.PagerSnapDistance
import androidx.compose.foundation.pager.PagerState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
internal fun NavigatorPager(
    modifier: Modifier = Modifier,
    state: PagerState,
    reverseLayout: Boolean,
    beyondViewportPageCount: Int = 2,
    pageContent: @Composable PagerScope.(Int) -> Unit

) {
    val flingBehavior = PagerDefaults.flingBehavior(
        state = state,
        pagerSnapDistance = PagerSnapDistance.atMost(0)
    )

    HorizontalPager(
        modifier = modifier,
        userScrollEnabled = false,
        state = state,
        beyondViewportPageCount = beyondViewportPageCount,
        reverseLayout = reverseLayout,
        flingBehavior = flingBehavior,
        pageNestedScrollConnection = PagerNestedConnection(
            state,
            flingBehavior,
            Orientation.Horizontal
        ),
        pageContent = pageContent
    )
}
